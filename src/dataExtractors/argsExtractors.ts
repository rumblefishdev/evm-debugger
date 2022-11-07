import { ethers } from 'hardhat'
import { readMemory } from '../helpers/helpers'
import {
    TCallArgs,
    TCallCodeArgs,
    TCreate2Args,
    TCreateArgs,
    TDelegateCallArgs,
    TReturnArgs,
    TRevertArgs,
    TStaticCallArgs,
} from '../typings/opcodes'

export const extractCallTypeArgsData = (item: TCallArgs | TCallCodeArgs | TDelegateCallArgs | TStaticCallArgs, memory: string[]) => {
    // IF CALL OR CALLCODE THEN ENSURE THAT VALUE IS EXTRACTED
    const rawValue = 'value' in item ? `0x${item['value']}` : '0x0'
    const value = ethers.utils.formatEther(rawValue)

    const { address, inputLength, inputOffset, returnLength, returnOffset } = item

    const input = readMemory(memory, inputOffset, inputLength)

    const output = readMemory(memory, returnOffset, returnLength)

    const parsedAddress = `0x${address.slice(-40)}`

    return { address: parsedAddress, value, input, output }
}

export const extractReturnTypeArgsData = (item: TReturnArgs | TRevertArgs, memory: string[]) => {
    const { length, position } = item
    const output = readMemory(memory, position, length)

    return { output }
}

export const extractCreateTypeArgsData = (item: TCreateArgs | TCreate2Args, memory: string[]) => {
    const { value, byteCodeSize, byteCodePosition } = item

    const input = readMemory(memory, byteCodePosition, byteCodeSize)

    const defaultReturn = { value: ethers.utils.formatEther(value), input }

    if ('salt' in item) {
        return { ...defaultReturn, salt: item.salt }
    }

    return defaultReturn
}
