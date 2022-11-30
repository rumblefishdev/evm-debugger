import { ethers } from 'ethers'
import type { TCallTypeArgs, TCreateTypeArgs, TOpCodesArgs, TReturnTypeArgs, TOpCodesWithArgs } from '@evm-debuger/types'

import { OpCodesArgsArray } from '../constants/constants'
import { readMemory } from '../helpers/helpers'

export const extractArgsFromStack = (stack: string[], op: TOpCodesWithArgs) => {
  const opCodeArgumentsNames = OpCodesArgsArray[op]

  const opCodeArguments = {} as TOpCodesArgs[typeof op]

  opCodeArgumentsNames.forEach((arg: string, index: number) => {
    opCodeArguments[arg] = stack[stack.length - index - 1]
  })

  return opCodeArguments
}

export const extractCallTypeArgsData = (item: TCallTypeArgs, memory: string[]) => {
  // IF CALL OR CALLCODE THEN ENSURE THAT VALUE IS EXTRACTED
  const rawValue = 'value' in item ? `0x${item['value']}` : '0x0'
  const value = ethers.utils.formatEther(rawValue)

  const { address, inputLength, inputOffset, returnLength, returnOffset } = item

  const input = readMemory(memory, inputOffset, inputLength)

  const output = readMemory(memory, returnOffset, returnLength)

  const parsedAddress = `0x${address.slice(-40)}`

  return { value, output, input, address: parsedAddress }
}

export const extractReturnTypeArgsData = (item: TReturnTypeArgs, memory: string[]) => {
  const { length, position } = item
  const output = readMemory(memory, position, length)

  return { output }
}

export const extractCreateTypeArgsData = (item: TCreateTypeArgs, memory: string[]) => {
  const { value, byteCodeSize, byteCodePosition } = item

  const input = readMemory(memory, byteCodePosition, byteCodeSize)

  const defaultReturn = { value: ethers.utils.formatEther(value), input }

  if ('salt' in item) return { ...defaultReturn, salt: item.salt }

  return defaultReturn
}
