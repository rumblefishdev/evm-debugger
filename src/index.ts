import { chceckIfOfCallType, filterForBaseLogs } from './helpers'
import { OpCodesArgs, OpCodesArgsArray } from './opcodes'
import { CallTypeTraceLogs, CreateTypeTraceLogs, ParsedTraceLogs, ReturnedTraceLogs, ReturnTypeTraceLogs, StopTypeTraceLogs } from './types'
import { TraceLogsParserHelper } from './dataTransformers'
import { getTransactionTrace } from './blockchainGetters'

async function main() {
    const trace = await getTransactionTrace('0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682')

    const filteredTrace = await filterForBaseLogs(trace.structLogs)
    const traceLogsParserHelper = new TraceLogsParserHelper()

    const extractedDataFromTraceLogs = filteredTrace.map((item) => {
        const { depth, memory, op, stack, index } = item

        const defaultExtractedData = traceLogsParserHelper.extractDefaultData(item)

        // STOP
        if (op === 'STOP') {
            return { ...defaultExtractedData } as StopTypeTraceLogs
        }

        const opCodeArgumentsNames = OpCodesArgsArray[op]

        const opCodeArguments = {} as OpCodesArgs[typeof op]

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
            } as CallTypeTraceLogs
        }

        // REVERT AND RETURN
        if ('length' in opCodeArguments && 'position' in opCodeArguments) {
            return {
                ...traceLogsParserHelper.extractReturnTypeArgsData(opCodeArguments, memory),
                ...defaultExtractedData,
            } as ReturnTypeTraceLogs
        }

        // CREATE | CREATE2
        if ('byteCodePosition' in opCodeArguments && 'byteCodeSize' in opCodeArguments) {
            return {
                ...traceLogsParserHelper.extractCreateTypeArgsData(opCodeArguments, memory),
                ...defaultExtractedData,
            } as CreateTypeTraceLogs
        }
    }) as ReturnedTraceLogs[]

    const enrichedDataWithCallContextReturn = extractedDataFromTraceLogs.map((item, index) => {
        const { depth } = item

        if (chceckIfOfCallType(item)) {
            const lastItemInCallContext = traceLogsParserHelper.getLastItemInCallContext(extractedDataFromTraceLogs, index, depth)

            if (lastItemInCallContext.type === 'RETURN') {
                const { output, index } = lastItemInCallContext
                return { ...item, output, returnIndex: index } as CallTypeTraceLogs
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

    const onlyCallType = enrichedDataWithCallContextReturn.filter((item) => chceckIfOfCallType(item)) as CallTypeTraceLogs[]

    console.log(onlyCallType)
}

main()
