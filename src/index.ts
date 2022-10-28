import { chceckIfOfCallType, filterForBaseLogs } from './helpers'
import { TOpCodesArgs, OpCodesArgsArray } from './opcodes'
import { ICallTypeTraceLogs, ICreateTypeTraceLogs, TReturnedTraceLogs, IReturnTypeTraceLogs, IStopTypeTraceLogs } from './types'
import { TraceLogsParserHelper } from './dataTransformers'
import { getTransactionByHash, getTransactionTrace } from './blockchainGetters'

async function main() {
    const rootTransactionLog = await getTransactionByHash('0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682')

    const trace = await getTransactionTrace('0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682')

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
            } as ICreateTypeTraceLogs
        }
    }) as TReturnedTraceLogs[]

    // Add root transaction log to list of trace logs
    extractedDataFromTraceLogs.unshift(traceLogsParserHelper.convertRootLogsToTraceLogs(rootTransactionLog))

    const enrichedDataWithCallContextReturn = extractedDataFromTraceLogs.map((item, index) => {
        const { depth } = item

        if (chceckIfOfCallType(item)) {
            const lastItemInCallContext = traceLogsParserHelper.getLastItemInCallContext(extractedDataFromTraceLogs, index, depth)

            if (lastItemInCallContext.type === 'RETURN') {
                const { output, index } = lastItemInCallContext
                return { ...item, output, returnIndex: index } as ICallTypeTraceLogs
            }
        }

        return item
    })

    for (let i = 0; i < enrichedDataWithCallContextReturn.length; i++) {
        const item = enrichedDataWithCallContextReturn[i]

        if (chceckIfOfCallType(item)) {
            enrichedDataWithCallContextReturn[i] = await traceLogsParserHelper.extendCallDataWithDecodedInputOutput(item)
        }
    }

    const onlyCallType = enrichedDataWithCallContextReturn.filter((item) => chceckIfOfCallType(item)) as ICallTypeTraceLogs[]

    console.log(onlyCallType)
}

main()
