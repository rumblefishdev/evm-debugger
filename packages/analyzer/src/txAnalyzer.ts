import type {
    IFilteredStructLog,
    IStructLog,
    TDataProvider,
    TEventInfo,
    TMainTraceLogs,
    TReturnedTraceLog,
    IContractAddress
} from '@evm-debuger/types'

import {
    checkIfOfCallType,
    checkIfOfCreateType,
    checkIfOfReturnType,
    convertTxInfoToTraceLog,
    getBaseStructLogs,
    getCallAndCreateType,
    getLastItemInCallTypeContext,
    isLogType,
    getSafeHex,
    readMemory,
} from './helpers/helpers'
import {StructLogParser} from './dataExtractors/structLogParser'
import {StackCounter} from './helpers/stackCounter'
import {StorageHandler} from './dataExtractors/storageHandler'
import {AbiReader} from './helpers/abiReader'
import {FragmentReader} from './helpers/fragmentReader'
import {extractLogTypeArgsData} from './dataExtractors/argsExtractors'

export class TxAnalyzer {
    constructor(private readonly dataProvider: TDataProvider, private readonly transactionHash: string) {
    }

    private readonly storageHandler = new StorageHandler()
    private readonly stackCounter = new StackCounter()
    private readonly abiReader = new AbiReader(this.dataProvider)
    private readonly fragmentReader = new FragmentReader()

    private structLogs: IStructLog[]
    private filteredStructLogs: IFilteredStructLog[]
    private parsedTransactionList: TReturnedTraceLog[]
    private contractAddressesLists: IContractAddress[] = []

    private async getStructLogs() {
        const trace = await this.dataProvider.getTransactionTrace(this.transactionHash)
        const filteredStructLogs = getBaseStructLogs(trace.structLogs)

        this.structLogs = trace.structLogs
        this.filteredStructLogs = filteredStructLogs
    }

    private parseStructLogs() {
        return this.filteredStructLogs.map((item) => {
            const structLogParser = new StructLogParser(item, this.structLogs, this.stackCounter)

            // CALL | CALLCODE | DELEGATECALL | STATICCALL
            if (checkIfOfCallType(item)) return structLogParser.parseCallStructLog()

            // CREATE | CREATE2
            if (checkIfOfCreateType(item)) return structLogParser.parseCreateStructLog()

            // REVERT AND RETURN
            if (checkIfOfReturnType(item)) return structLogParser.parseReturnStructLog()

            // STOP
            if (item.op === 'STOP') return structLogParser.parseStopStructLog()
        }) as TReturnedTraceLog[]
    }

    private async parseAndAddRootTraceLog() {
        const transactionInfo = await this.dataProvider.getTransactionByHash(this.transactionHash)

        const rootTraceLog = convertTxInfoToTraceLog(this.structLogs[0], transactionInfo)
        const {blockNumber} = rootTraceLog

        this.parsedTransactionList.unshift(rootTraceLog)

        return this.parsedTransactionList.map((item) => {
            if (checkIfOfCallType(item) || checkIfOfCreateType(item)) return {...item, blockNumber} as TReturnedTraceLog

            return item
        })
    }

    private returnTransactionListWithContractFlag() {
        return this.parsedTransactionList.map((item) => {
            if (checkIfOfCallType(item)) {
                const {index, depth, address} = item
                const nextStructLog = this.structLogs[index + 1]

                if (nextStructLog.depth === depth + 1) {
                    if (!this.contractAddressesLists.includes({index, address})) this.contractAddressesLists.push({index, address})

                    return {...item, isContract: true}
                }
            }

            return item
        })
    }

    private combineCallWithItsReturn() {
        return this.parsedTransactionList.map((item, rootIndex) => {
            if ((checkIfOfCallType(item) && item.isContract) || checkIfOfCreateType(item)) {
                const lastItemInCallContext = getLastItemInCallTypeContext(this.parsedTransactionList, rootIndex, item.depth)

            if (!lastItemInCallContext) return { ...item, isSuccess: false }

                const {index, passedGas} = lastItemInCallContext
                const gasCost = item.passedGas - passedGas

                if (lastItemInCallContext.type === 'RETURN' || lastItemInCallContext.type === 'REVERT') {
                    const {output} = lastItemInCallContext
                    const isSuccess = lastItemInCallContext.type === 'RETURN'
                    return { ...item, returnIndex: index, output, isSuccess, gasCost }
                }
                return { ...item, returnIndex: index, isSuccess: true, gasCost }
            }
            return item
        })
    }

    private async decodeCallInputOutput() {
    const abis = await this.abiReader.getAbis(this.contractAddressesLists.map(contractAddress => contractAddress.address))

        Object.keys(abis).forEach((address) => {
            this.fragmentReader.loadFragmentsFromAbi(abis[address])
        })

        this.parsedTransactionList.forEach((item, index) => {
            if (checkIfOfCallType(item) && item.isContract && item.input) {
                const {
                    decodedInput,
                    decodedOutput,
                    functionDescription,
                    errorDescription
                } = this.fragmentReader.decodeFragment(
                    item.isSuccess,
                    item.input,
                    item.output
                )

                this.parsedTransactionList[index] = {
                    ...item,
                    functionDescription,
                    errorDescription,
                    decodedOutput,
                    decodedInput
                }
            }
        })
    }

    private parseLogsData() {
        this.parsedTransactionList.forEach((item, index) => {
            if (checkIfOfCallType(item) && item.isContract && item.isSuccess) {
                const events: TEventInfo[] = []

                const { startIndex, returnIndex, depth } = item

                const callStructLogContext = [...this.structLogs].slice(startIndex, returnIndex).filter((element) => element.depth === depth + 1)

                const logTypeStructLogs = callStructLogContext.filter(isLogType)

                logTypeStructLogs.forEach((logTypeStructLog) => {
                    const { memory } = logTypeStructLog
                    const { logDataLength, logDataOffset, topics } = extractLogTypeArgsData(logTypeStructLog)

                    const logData = getSafeHex(readMemory(memory, logDataOffset, logDataLength))

                    const eventResult = this.fragmentReader.decodeEvent(logData, topics)

                    events.push(eventResult)
                })
                this.parsedTransactionList[index] = { ...item, events }
            }
        })
    }

    private parseStorageData(transactionList: TReturnedTraceLog[]) {
        for (let index = 0; index < transactionList.length; index++) {
            const traceLog = transactionList[index]

            if ((checkIfOfCallType(traceLog) && traceLog.isContract) || checkIfOfCreateType(traceLog)) {
                const storageLogs = this.storageHandler.getParsedStorageLogs(traceLog, this.structLogs)
                const storageAddress = this.storageHandler.resolveStorageAddress(traceLog, transactionList[index - 1] as ICallTypeTraceLog , this.structLogs);

                transactionList[index] = { ...traceLog, storageLogs, storageAddress }
            }
        }

        return transactionList
    }

    public async analyze() {
        await this.getStructLogs()

        this.parsedTransactionList = this.parseStructLogs()

        this.parsedTransactionList = await this.parseAndAddRootTraceLog()

        this.parsedTransactionList = this.returnTransactionListWithContractFlag()

        this.parsedTransactionList = this.combineCallWithItsReturn()

        await this.decodeCallInputOutput()

        this.parsedTransactionList = getCallAndCreateType(this.parsedTransactionList)

        const parsedStorageData = this.parseStorageData(this.parsedTransactionList)

        this.parseLogsData()

        return this.parsedTransactionList as TMainTraceLogs[]
    }

    public async baseAnalyze() {
        await this.getStructLogs()

        this.parsedTransactionList = this.parseStructLogs()

        this.parsedTransactionList = await this.parseAndAddRootTraceLog()

        this.parsedTransactionList = this.returnTransactionListWithContractFlag()

        this.parsedTransactionList = this.combineCallWithItsReturn()

        this.parsedTransactionList = getCallAndCreateType(this.parsedTransactionList)

    return this.parseStorageData(this.parsedTransactionList) as TMainTraceLogs[]
    }
}
