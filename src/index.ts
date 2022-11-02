import { chceckIfOfCallType, checkIfOfCreateType, filterForBaseLogs } from './helpers'
import { TOpCodesArgs, OpCodesArgsArray } from './opcodes'
import { ICallTypeTraceLogs, ICreateTypeTraceLogs, TReturnedTraceLogs, IReturnTypeTraceLogs, IStopTypeTraceLogs } from './types'
import { TraceLogsParserHelper } from './dataTransformers'
import { getTransactionByHash, getTransactionReceipt, getTransactionTrace } from './blockchainGetters'
import { writeFileSync } from 'fs'

async function main() {
    const transactionHash = '0x8136bfb671e98ab1cc279df575abe3ea551f8fa7c7c787f4f6a7ed614b4b7247' // Root = Call | Failed | [Call,DelegateCall,StaticCall,Revert,Revert]
    // const transactionHash = '0x5bd69cab4bbd5864a18ec23bd685d94c9ab58e94662409ea10fea756019e3c4f' // Root = Call | Failed | [Call,Create,Revert]
    // const transactionHash = '0xfe12892c9676881b66807797002e2c9473ef5ee62dddeb8adc30eb62f18612b7' // Root = Create | Success | [Create,Return]
    // const transactionHash = '0x8733fe2859afb044abe28859e71486d24758706320fdf47eb280c5fbc9bee51f' // Root = Call | Success | [Call,Create,Return]
    // const transactionHash = '0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682' // Root = Call |  Success | [Call,StaticCall,Return,Stop]

    const rootTransactionLog = await getTransactionByHash(transactionHash)

    const trace = await getTransactionTrace(transactionHash)

    const filteredTrace = await filterForBaseLogs(trace.structLogs)
    const traceLogsParserHelper = new TraceLogsParserHelper()

    const extractedDataFromTraceLogs = filteredTrace.map((item) => {
        const { depth, memory, op, stack, index } = item

        const defaultExtractedData = traceLogsParserHelper.extractDefaultData(item)

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
                ...traceLogsParserHelper.extractCallTypeArgsData(opCodeArguments, memory),
                ...defaultExtractedData,
                startIndex: index + 1,
                passedGas: trace.structLogs[index + 1].gas,
                stackTrace: traceLogsParserHelper.createStackTrace(depth),
            } as ICallTypeTraceLogs
        }

        // REVERT AND RETURN
        if ('length' in opCodeArguments && 'position' in opCodeArguments) {
            return {
                ...traceLogsParserHelper.extractReturnTypeArgsData(opCodeArguments, memory),
                ...defaultExtractedData,
            } as IReturnTypeTraceLogs
        }

        // CREATE | CREATE2
        if ('byteCodePosition' in opCodeArguments && 'byteCodeSize' in opCodeArguments) {
            return {
                ...traceLogsParserHelper.extractCreateTypeArgsData(opCodeArguments, memory),
                ...defaultExtractedData,
                startIndex: index + 1,
                passedGas: trace.structLogs[index + 1].gas,
                stackTrace: traceLogsParserHelper.createStackTrace(depth),
            } as ICreateTypeTraceLogs
        }
    }) as TReturnedTraceLogs[]

    // Add root transaction log to list of trace logs
    extractedDataFromTraceLogs.unshift(traceLogsParserHelper.convertRootLogsToTraceLogs(trace.structLogs[0], rootTransactionLog))

    const enrichedDataWithCallContextReturn = extractedDataFromTraceLogs.map((item, rootIndex) => {
        const { depth } = item

        if (chceckIfOfCallType(item) || checkIfOfCreateType(item)) {
            const lastItemInCallContext = traceLogsParserHelper.getLastItemInCallContext(extractedDataFromTraceLogs, rootIndex, depth)

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

    for (let i = 0; i < enrichedDataWithCallContextReturn.length; i++) {
        const item = enrichedDataWithCallContextReturn[i]

        const { depth } = item

        if (chceckIfOfCallType(item)) {
            const lastItemInCallContext = traceLogsParserHelper.getLastItemInCallContext(extractedDataFromTraceLogs, i, depth)

            if (lastItemInCallContext.type !== 'REVERT') {
                enrichedDataWithCallContextReturn[i] = await traceLogsParserHelper.extendCallDataWithDecodedInputOutput(item)
            }

            if (lastItemInCallContext.type === 'REVERT') {
                enrichedDataWithCallContextReturn[i] = await traceLogsParserHelper.extendCallDataWithDecodedErrorOutput(item)
            }
        }
    }

    const onlyCallAndCreateType = enrichedDataWithCallContextReturn.filter(
        (item) => chceckIfOfCallType(item) || checkIfOfCreateType(item)
    ) as ICallTypeTraceLogs[]

    // console.log(enrichedDataWithCallContextReturn)
    console.log(onlyCallAndCreateType)
    // console.log(onlyCallAndCreateType.map((item) => ({ stackTrace: item.stackTrace, passedGas: item.passedGas, gasCost: item.gasCost })))
}

main()
