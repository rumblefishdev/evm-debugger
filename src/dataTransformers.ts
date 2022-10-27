import { AbiReader } from './abiReader'
import { StackCounter } from './stackCounter'
import { readMemory } from './helpers'
import {
    TCallArgs,
    TCallCodeArgs,
    TCreate2Args,
    TCreateArgs,
    TDelegateCallArgs,
    TReturnArgs,
    TRevertArgs,
    TStaticCallArgs,
} from './opcodes'
import {
    ICallTypeTraceLogs,
    IParsedTraceLogs,
    TReturnedTraceLogs,
    IReturnTypeTraceLogs,
    IStopTypeTraceLogs,
    IStructLogWithIndex,
} from './types'

export class TraceLogsParserHelper {
    private readonly stackCounter = new StackCounter()
    private readonly abiReader = new AbiReader()

    public extractDefaultData(item: IStructLogWithIndex) {
        const { depth, gas, gasCost, op, pc, index } = item

        return { type: op, depth, passedGas: gas, gasCost, pc, index } as IParsedTraceLogs
    }

    public extractCallTypeArgsData(
        item: TCallArgs | TCallCodeArgs | TDelegateCallArgs | TStaticCallArgs,

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

    public extractReturnTypeArgsData(item: TReturnArgs | TRevertArgs, memory: string[]) {
        const { length, position } = item
        const output = readMemory(memory, position, length)

        return { output }
    }

    public extractCreateTypeArgsData(item: TCreateArgs | TCreate2Args, memory: string[]) {
        return {}
    }

    public createStackTrace(depth: number): number[] {
        return this.stackCounter.visitDepth(depth)
    }

    public getLastItemInCallContext(traceLogs: TReturnedTraceLogs[], currentIndex: number, depth) {
        return traceLogs
            .slice(currentIndex)
            .find(
                (iteratedItem) =>
                    iteratedItem.depth === depth + 1 &&
                    (iteratedItem.type === 'RETURN' || iteratedItem.type === 'REVERT' || iteratedItem.type === 'STOP')
            ) as IReturnTypeTraceLogs | IStopTypeTraceLogs
    }

    public async extendCallDataWithDecodedInputOutput(item: ICallTypeTraceLogs) {
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
