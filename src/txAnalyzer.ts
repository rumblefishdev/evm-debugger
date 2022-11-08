import {
    chceckIfOfCallType,
    checkIfOfCreateType,
    checkIfOfReturnType,
    convertTxInfoToTraceLog,
    dumpResultsToJson,
    getCallAndCreateType,
    getBaseStructLogs,
    getLastItemInCallTypeContext,
} from './helpers/helpers'
import { StructLogParser } from './dataExtractors/structLogParser'
import { StackCounter } from './helpers/stackCounter'
import { StorageHandler } from './dataExtractors/storageHandler'
import { AbiReader } from './helpers/abiReader'
import { TDataProvider } from './typings'
import { IFilteredStructLog, IStructLog } from './typings/structLogs'
import { TReturnedTraceLog } from './typings/parsedLogs'

export class TxAnalyzer {
    constructor(private readonly dataProvider: TDataProvider, private readonly transactionHash: string) {}

    private readonly stackCounter = new StackCounter()
    private readonly abiReader = new AbiReader(this.dataProvider)

    private traceLogs: IStructLog[]
    private filteredStructLogs: IFilteredStructLog[]
    private parsedTransactionList: TReturnedTraceLog[]

    private async getTraceLogs() {
        const trace = await this.dataProvider.getTransactionTrace(this.transactionHash)
        const filteredStructLogs = getBaseStructLogs(trace.structLogs)

        this.traceLogs = trace.structLogs
        this.filteredStructLogs = filteredStructLogs
    }

    private parseStructLogs() {
        return this.filteredStructLogs.map((item) => {
            const structLogParser = new StructLogParser(item, this.traceLogs, this.stackCounter)

            // CALL | CALLCODE | DELEGATECALL | STATICCALL
            if (chceckIfOfCallType(item)) {
                return structLogParser.parseCallStructLog()
            }

            // CREATE | CREATE2
            if (checkIfOfCreateType(item)) {
                return structLogParser.parseCreateStructLog()
            }

            // REVERT AND RETURN
            if (checkIfOfReturnType(item)) {
                return structLogParser.parseReturnStructLog()
            }

            // STOP
            if (item.op === 'STOP') {
                return structLogParser.parseStopStructLog()
            }
        }) as TReturnedTraceLog[]
    }

    private async parseAndAddRootTraceLog() {
        const rootTransactionLog = await this.dataProvider.getTransactionByHash(this.transactionHash)
        this.parsedTransactionList.unshift(convertTxInfoToTraceLog(this.traceLogs[0], rootTransactionLog))
    }

    private async checkIfCallPointsToContract() {
        for (let i = 0; i < this.parsedTransactionList.length; i++) {
            const item = this.parsedTransactionList[i]

            if (chceckIfOfCallType(item)) {
                const byteCode = await this.dataProvider.getContractCode(item.address)
                const isContract = byteCode !== '0x'

                this.parsedTransactionList[i] = { ...item, isContract }
            }
        }
    }

    private combineCallWithItsReturn() {
        return this.parsedTransactionList.map((item, rootIndex) => {
            if ((chceckIfOfCallType(item) && item.isContract) || checkIfOfCreateType(item)) {
                const lastItemInCallContext = getLastItemInCallTypeContext(this.parsedTransactionList, rootIndex, item.depth)

                // If nested Call is Reverted, Parent Call won't have Return Item
                if (!lastItemInCallContext) {
                    return item
                }
                const { index, passedGas } = lastItemInCallContext
                const gasCost = item.passedGas - passedGas

                if (lastItemInCallContext.type === 'RETURN' || lastItemInCallContext.type === 'REVERT') {
                    const { output } = lastItemInCallContext
                    const isSuccess = lastItemInCallContext.type === 'RETURN'
                    return { ...item, output, gasCost, returnIndex: index, success: isSuccess }
                }
                return { ...item, returnIndex: index, gasCost, success: true }
            }
            return item
        })
    }

    private async decodeCallInputOutput() {
        for (let i = 0; i < this.parsedTransactionList.length; i++) {
            const item = this.parsedTransactionList[i]

            const { depth } = item

            if (chceckIfOfCallType(item) && item.isContract && item.input) {
                const lastItemInCallContext = getLastItemInCallTypeContext(this.parsedTransactionList, i, depth)

                if (lastItemInCallContext.type !== 'REVERT') {
                    this.parsedTransactionList[i] = await this.abiReader.decodeTraceLogInputOutput(item)
                }

                if (lastItemInCallContext.type === 'REVERT') {
                    this.parsedTransactionList[i] = await this.abiReader.decodeTraceLogErrorInputOutput(item)
                }
            }
        }
    }

    private parseStorageData() {
        return this.parsedTransactionList.map((item) => {
            if ((chceckIfOfCallType(item) && item.isContract) || checkIfOfCreateType(item)) {
                const storageHandler = new StorageHandler(this.traceLogs, item)

                return storageHandler.parseStorageData()
            }
            return item
        })
    }

    public async analyze() {
        await this.getTraceLogs()

        this.parsedTransactionList = this.parseStructLogs()

        await this.parseAndAddRootTraceLog()

        await this.checkIfCallPointsToContract()

        this.parsedTransactionList = this.combineCallWithItsReturn()

        await this.decodeCallInputOutput()

        this.parsedTransactionList = getCallAndCreateType(this.parsedTransactionList)

        this.parsedTransactionList = this.parseStorageData()

        dumpResultsToJson(this.transactionHash, this.traceLogs, this.parsedTransactionList)

        return this.parsedTransactionList
    }
}
