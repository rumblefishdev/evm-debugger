import { AbiReader } from './abiReader'
import { Counter } from './counter'
import { readMemory } from './helpers'
import { CallArgs, CallCodeArgs, Create2Args, CreateArgs, DelegateCallArgs, ReturnArgs, RevertArgs, StaticCallArgs } from './opcodes'
import { CallTypeTraceLogs, ParsedTraceLogs, ReturnedTraceLogs, ReturnTypeTraceLogs, StopTypeTraceLogs, StructLogWithIndex } from './types'

export class TraceLogsParserHelper {
    private readonly stackCounter = new Counter()
    private readonly abiReader = new AbiReader()

    public extractDefaultData(item: StructLogWithIndex) {
        const { depth, gas, gasCost, op, pc, index } = item

        return { type: op, depth, passedGas: gas, gasCost, pc, index } as ParsedTraceLogs
    }

    public extractCallTypeArgsData(
        item: CallArgs | CallCodeArgs | DelegateCallArgs | StaticCallArgs,

        memory: string[]
    ) {
        // IF CALL OR CALLCODE THEN ENSURE THAT VALUE IS EXTRACTED
        const value = 'value' in item ? `0x${item['value']}` : '0x0'

        const { address, inputLength, inputOffset, returnLength, returnOffset } = item

        const input = readMemory(memory, inputOffset, inputLength)

        const output = readMemory(memory, returnOffset, returnLength)

        const parsedAddress = `0x${address.slice(-40)}`

        return { address: parsedAddress, value, input, output }
    }

    public extractReturnTypeArgsData(item: ReturnArgs | RevertArgs, memory: string[]) {
        const { length, position } = item
        const output = readMemory(memory, position, length)

        return { output }
    }

    public extractCreateTypeArgsData(item: CreateArgs | Create2Args, memory: string[]) {
        return {}
    }

    public createStackTrace(depth: number): number[] {
        return this.stackCounter.getCount(depth)
    }

    public getLastItemInCallContext(traceLogs: ReturnedTraceLogs[], currentIndex: number, depth) {
        return traceLogs
            .slice(currentIndex)
            .find(
                (iteratedItem) =>
                    iteratedItem.depth === depth + 1 &&
                    (iteratedItem.type === 'RETURN' || iteratedItem.type === 'REVERT' || iteratedItem.type === 'STOP')
            ) as ReturnTypeTraceLogs | StopTypeTraceLogs
    }

    public async extendCallDataWithDecodedInputOutput(item: CallTypeTraceLogs) {
        const { address, input, output } = item
        const iFace = await this.abiReader.getAbi(address)

        if (iFace) {
            const decodedInput = iFace.parseTransaction({ data: `0x${input}` })
            const decodedOutput = iFace.decodeFunctionResult(decodedInput.functionFragment, `0x${output}`)

            return { ...item, decodedInput, decodedOutput }
        }

        return item
    }
}
