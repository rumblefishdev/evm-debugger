import { AbiReader } from './abiReader'
import { StackCounter } from './stackCounter'
import { decodeErrorResult, getSafeHex, readMemory } from './helpers'
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
    TTransactionRootLog,
    IStructLog,
    ICreateTypeTraceLogs,
    IDataProvider,
} from './types'
import { ethers } from 'ethers'
import { getContractCode } from './blockchainGetters'

export class TraceLogsParserHelper {
    constructor(private readonly dataProvider: IDataProvider) {}

    private readonly stackCounter = new StackCounter()
    private readonly abiReader = new AbiReader(this.dataProvider)

    public async checkIfAddressIsContract(address: string) {
        const byteCode = await this.dataProvider.getContractCode(address)

        return byteCode !== '0x'
    }

    public convertRootLogsToTraceLogs(firstNestedItem: IStructLog, rootLogs: TTransactionRootLog) {
        const { to, input, value } = rootLogs

        const defaultFields = {
            type: 'CALL',
            depth: 0,
            index: 0,
            startIndex: 1,
            stackTrace: [] as number[],
            input: input.slice(2),
            passedGas: firstNestedItem.gas,
            value: ethers.utils.formatEther(value),
            pc: 0,
            gasCost: 0,
        } as ICallTypeTraceLogs | ICreateTypeTraceLogs

        if (to) {
            return { ...defaultFields, address: to } as ICallTypeTraceLogs
        }

        return { ...defaultFields, type: 'CREATE' } as ICreateTypeTraceLogs
    }

    public async checkIfAddressIsContract(address: string) {
        const byteCode = await getContractCode(address)

        return byteCode !== '0x'
    }

    public convertRootLogsToTraceLogs(firstNestedItem: IStructLog, rootLogs: TTransactionRootLog) {
        const { to, input, value } = rootLogs

        const defaultFields = {
            type: 'CALL',
            depth: 0,
            index: 0,
            startIndex: 1,
            stackTrace: [] as number[],
            input: input.slice(2),
            passedGas: firstNestedItem.gas,
            value: ethers.utils.formatEther(value),
            pc: 0,
            gasCost: 0,
        } as ICallTypeTraceLogs | ICreateTypeTraceLogs

        if (to) {
            return { ...defaultFields, address: to } as ICallTypeTraceLogs
        }

        return { ...defaultFields, type: 'CREATE' } as ICreateTypeTraceLogs
    }

    public extractDefaultData(item: IStructLogWithIndex) {
        const { depth, gas, gasCost, op, pc, index } = item

        return { type: op, depth, passedGas: gas, gasCost, pc, index } as IParsedTraceLogs
    }

    public extractCallTypeArgsData(
        item: TCallArgs | TCallCodeArgs | TDelegateCallArgs | TStaticCallArgs,

        memory: string[]
    ) {
        // IF CALL OR CALLCODE THEN ENSURE THAT VALUE IS EXTRACTED
        const rawValue = 'value' in item ? `0x${item['value']}` : '0x0'
        const value = ethers.utils.formatEther(rawValue)

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
        const { value, byteCodeSize, byteCodePosition } = item

        const input = readMemory(memory, byteCodePosition, byteCodeSize)

        const defaultReturn = { value: ethers.utils.formatEther(value), input }

        if ('salt' in item) {
            return { ...defaultReturn, salt: item.salt }
        }

        return defaultReturn
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
            const decodedInput = iFace.parseTransaction({ data: getSafeHex(input) })
            const decodedOutput = iFace.decodeFunctionResult(decodedInput.functionFragment, getSafeHex(output))

            return { ...item, decodedInput, decodedOutput, success: true }
        }

        return item
    }

    public async extendCallDataWithDecodedErrorOutput(item: ICallTypeTraceLogs) {
        const { address, output, input } = item
        const iFace = await this.abiReader.getAbi(address)

        if (iFace) {
            const decodedInput = iFace.parseTransaction({ data: getSafeHex(input) })

            const decodedOutput = decodeErrorResult(iFace, getSafeHex(output))

            return { ...item, decodedInput, decodedOutput, success: false }
        }

        return item
    }
}
