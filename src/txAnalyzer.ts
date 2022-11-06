import { chceckIfOfCallType, checkIfOfCreateType, dumpResultsToJson, filterForBaseLogs } from './helpers/helpers'
import { TOpCodesArgs, OpCodesArgsArray } from './typings/opcodes'
import {
    ICallTypeTraceLogs,
    ICreateTypeTraceLogs,
    TReturnedTraceLogs,
    IReturnTypeTraceLogs,
    IStopTypeTraceLogs,
    IDataProvider,
    TTransactionRootLog,
    IStructLog,
    IStructLogWithIndex,
    TLoadedStorage,
    TChangedStorage,
} from './typings/types'
import { TraceLogsParserHelper } from './dataExtractors/dataTransformers'

export class TxAnalyzer {
    constructor(private readonly dataProvider: IDataProvider, private readonly transactionHash: string) {}

    private traceLogsParserHelper = new TraceLogsParserHelper(this.dataProvider)

    private traceLogs: IStructLog[]
    private filteredTraceLogs: IStructLogWithIndex[]
    private rootTransactionLog: TTransactionRootLog
    private parsedTransactionList: TReturnedTraceLogs[]

    private async getTraceLogs() {
        const trace = await this.dataProvider.getTransactionTrace(this.transactionHash)
        const rootTransactionLog = await this.dataProvider.getTransactionByHash(this.transactionHash)
        const filteredTraceLogs = filterForBaseLogs(trace.structLogs)

        this.traceLogs = trace.structLogs
        this.rootTransactionLog = rootTransactionLog
        this.filteredTraceLogs = filteredTraceLogs
    }

    private parseTraceLogs() {
        const result = this.filteredTraceLogs.map((item) => {
            const { depth, memory, op, stack, index } = item

            const defaultExtractedData = this.traceLogsParserHelper.extractDefaultData(item)

            // STOP
            if (op === 'STOP') {
                return { ...defaultExtractedData } as IStopTypeTraceLogs
            }

            const opCodeArgumentsNames = OpCodesArgsArray[op]

            const opCodeArguments = {} as TOpCodesArgs[typeof op]

            opCodeArgumentsNames.forEach((arg: string, index: number) => {
                opCodeArguments[arg] = stack[stack.length - index - 1]
            })

            // CALL | CALLCODE | DELEGATECALL | STATICCALL
            if ('gas' in opCodeArguments && 'address' in opCodeArguments) {
                return {
                    ...this.traceLogsParserHelper.extractCallTypeArgsData(opCodeArguments, memory),
                    ...defaultExtractedData,
                    startIndex: index + 1,
                    passedGas: this.traceLogs[index + 1].gas,
                    stackTrace: this.traceLogsParserHelper.createStackTrace(depth),
                } as ICallTypeTraceLogs
            }

            // REVERT AND RETURN
            if ('length' in opCodeArguments && 'position' in opCodeArguments) {
                return {
                    ...this.traceLogsParserHelper.extractReturnTypeArgsData(opCodeArguments, memory),
                    ...defaultExtractedData,
                } as IReturnTypeTraceLogs
            }

            // CREATE | CREATE2
            if ('byteCodePosition' in opCodeArguments && 'byteCodeSize' in opCodeArguments) {
                return {
                    ...this.traceLogsParserHelper.extractCreateTypeArgsData(opCodeArguments, memory),
                    ...defaultExtractedData,
                    startIndex: index + 1,
                    passedGas: this.traceLogs[index + 1].gas,
                    stackTrace: this.traceLogsParserHelper.createStackTrace(depth),
                } as ICreateTypeTraceLogs
            }
        }) as TReturnedTraceLogs[]

        this.parsedTransactionList = result
    }

    private async addRootTransactionLogToList() {
        // Add root transaction log to list of trace logs
        this.parsedTransactionList.unshift(
            this.traceLogsParserHelper.convertRootLogsToTraceLogs(this.traceLogs[0], this.rootTransactionLog)
        )
    }

    private async checkIfCallPointToContract() {
        for (let i = 0; i < this.parsedTransactionList.length; i++) {
            const item = this.parsedTransactionList[i]

            if (chceckIfOfCallType(item)) {
                const isContract = await this.traceLogsParserHelper.checkIfAddressIsContract(item.address)
                this.parsedTransactionList[i] = { ...item, isContract }
            }
        }
    }

    private combineCallWithItsReturn() {
        return this.parsedTransactionList.map((item, rootIndex) => {
            const { depth } = item

            if ((chceckIfOfCallType(item) && item.isContract) || checkIfOfCreateType(item)) {
                const lastItemInCallContext = this.traceLogsParserHelper.getLastItemInCallContext(
                    this.parsedTransactionList,
                    rootIndex,
                    depth
                )

                // If nested Call is Reverted, Parent Call won't have Return Item
                if (!lastItemInCallContext) {
                    return item
                }

                const { index, passedGas } = lastItemInCallContext

                if (lastItemInCallContext.type === 'RETURN' || lastItemInCallContext.type === 'REVERT') {
                    const { output } = lastItemInCallContext
                    return { ...item, output, returnIndex: index, gasCost: item.passedGas - passedGas } as ICallTypeTraceLogs
                }

                return { ...item, returnIndex: index, gasCost: item.passedGas - passedGas } as ICallTypeTraceLogs
            }

            return item
        })
    }

    private async decodeCallInputOutput() {
        for (let i = 0; i < this.parsedTransactionList.length; i++) {
            const item = this.parsedTransactionList[i]

            const { depth } = item

            if (chceckIfOfCallType(item) && item.isContract && item.input) {
                const lastItemInCallContext = this.traceLogsParserHelper.getLastItemInCallContext(this.parsedTransactionList, i, depth)

                if (lastItemInCallContext.type !== 'REVERT') {
                    this.parsedTransactionList[i] = await this.traceLogsParserHelper.extendCallDataWithDecodedInputOutput(item)
                }

                if (lastItemInCallContext.type === 'REVERT') {
                    this.parsedTransactionList[i] = await this.traceLogsParserHelper.extendCallDataWithDecodedErrorOutput(item)
                }
            }
        }
    }

    private filterCallAndCreateType() {
        return this.parsedTransactionList.filter((item) => chceckIfOfCallType(item) || checkIfOfCreateType(item)) as Array<
            ICallTypeTraceLogs | ICreateTypeTraceLogs
        >
    }

    private extractStorageData() {
        return this.parsedTransactionList.map((item) => {
            if ((chceckIfOfCallType(item) && item.isContract) || checkIfOfCreateType(item)) {
                const { index, returnIndex } = item
                const loadedStorage: TLoadedStorage = []
                const changedStorage: TChangedStorage = []

                const executionContextLogs = this.traceLogsParserHelper.getCallExecutionTraceLogs(this.traceLogs, item)
                const storageTraceLogs = this.traceLogsParserHelper.extractStorageTraceLogs(executionContextLogs, index)

                storageTraceLogs.forEach((element, rootIndex) => {
                    const { op, stack, storage, index } = element

                    if (op === 'SLOAD') {
                        const key = stack[stack.length - 1]

                        loadedStorage.push({ key, value: storage[key], index })
                    }

                    if (op === 'SSTORE') {
                        const key = stack[stack.length - 1]
                        const value = stack[stack.length - 2]

                        const initialValue = storageTraceLogs[rootIndex - 1].storage[key]

                        changedStorage.push({ key, updatedValue: value, initialValue, index })
                    }
                })

                if (!returnIndex) {
                    return item
                }

                const storageOfReturnItem = this.traceLogs[returnIndex].storage

                const keys = Object.keys(storageOfReturnItem)

                const returnedStorage = keys.map((item) => {
                    return { key: item, value: storageOfReturnItem[item] }
                })

                return { ...item, storageLogs: { loadedStorage, changedStorage, returnedStorage } }
            }

            return item
        })
    }

    public async analyze() {
        await this.getTraceLogs()

        this.parseTraceLogs()

        await this.addRootTransactionLogToList()

        await this.checkIfCallPointToContract()

        this.parsedTransactionList = this.combineCallWithItsReturn()

        await this.decodeCallInputOutput()

        this.parsedTransactionList = this.filterCallAndCreateType()

        this.parsedTransactionList = this.extractStorageData()

        dumpResultsToJson(this.transactionHash, this.traceLogs, this.parsedTransactionList)

        return this.parsedTransactionList
    }
}
