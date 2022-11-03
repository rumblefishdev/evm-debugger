import { chceckIfOfCallType, checkIfOfCreateType, dumpResultsToJson, filterForBaseLogs } from './helpers'
import { TOpCodesArgs, OpCodesArgsArray } from './opcodes'
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
} from './types'
import { TraceLogsParserHelper } from './dataTransformers'
import { defaultDataProvider } from './blockchainGetters'

class TraceAnalyzer {
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

    public async analyze() {
        await this.getTraceLogs()

        this.parseTraceLogs()

        await this.addRootTransactionLogToList()

        await this.checkIfCallPointToContract()

        this.parsedTransactionList = this.combineCallWithItsReturn()

        await this.decodeCallInputOutput()

        this.parsedTransactionList = this.filterCallAndCreateType()

        dumpResultsToJson(this.transactionHash, this.traceLogs, this.parsedTransactionList)

        return this.parsedTransactionList
    }
}

async function main() {
    // const transactionHash = '0x8136bfb671e98ab1cc279df575abe3ea551f8fa7c7c787f4f6a7ed614b4b7247' // Root = Call | Failed | [Call,DelegateCall,StaticCall,Revert,Revert]
    // const transactionHash = '0x5bd69cab4bbd5864a18ec23bd685d94c9ab58e94662409ea10fea756019e3c4f' // Root = Call | Failed | [Call,Create,Revert]
    // const transactionHash = '0xfe12892c9676881b66807797002e2c9473ef5ee62dddeb8adc30eb62f18612b7' // Root = Create | Success | [Create,Return]
    // const transactionHash = '0x8733fe2859afb044abe28859e71486d24758706320fdf47eb280c5fbc9bee51f' // Root = Call | Success | [Call,Create,Return]
    // const transactionHash = '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682' // Root = Call |  Success | [Call,StaticCall,Return,Stop]
    const transactionHash = '0x75eb09c0c35347a44a006a8702a45b13539a5c666337d7b1ddb2ffcc85d14e90' // Root = Call |  Success | [Call,StaticCall,Return,Stop]

    const analyzer = new TraceAnalyzer(defaultDataProvider, transactionHash)

    console.log(await analyzer.analyze())
}

main()
