import { ethers } from 'ethers'
import type {
  TCallTypeArgs,
  TCreateTypeArgs,
  TOpCodesArgs,
  TReturnTypeArgs,
  TOpCodesWithArgs,
  ILogTypeStructLogs,
} from '@evm-debuger/types'

import { LogArgsArray, OpCodesArgsArray } from '../constants/constants'
import { getSafeHex, readMemory } from '../helpers/helpers'

export const extractArgsFromStack = (stack: string[], op: TOpCodesWithArgs) => {
  const opCodeArgumentsNames = OpCodesArgsArray[op]

  const opCodeArguments = {} as TOpCodesArgs[typeof op]

  opCodeArgumentsNames.forEach((arg: string, index: number) => {
    opCodeArguments[arg] = stack[stack.length - index - 1]
  })

  return opCodeArguments
}

export const extractLogTypeArgsData = (item: ILogTypeStructLogs) => {
  const { stack, op } = item

  const stackCopy = [...stack]

  const logArgsNames = LogArgsArray[op]

  const topicsList = logArgsNames.slice(2)

  const logDataOffset = stackCopy.at(-1)
  const logDataLength = stackCopy.at(-2)

  const extractedTopics = topicsList.map(() => getSafeHex(stackCopy.pop()))

  return { topics: extractedTopics, logDataOffset, logDataLength }
}

export const extractCallTypeArgsData = (item: TCallTypeArgs, memory: string[]) => {
  // IF CALL OR CALLCODE THEN ENSURE THAT VALUE IS EXTRACTED
  const rawValue = 'value' in item ? getSafeHex(item.value) : '0x0'
  const value = ethers.utils.formatEther(rawValue)

  const { address, inputLength, inputOffset, returnLength, returnOffset } = item

  const input = getSafeHex(readMemory(memory, inputOffset, inputLength))

  const output = getSafeHex(readMemory(memory, returnOffset, returnLength))

  const parsedAddress = getSafeHex(address.slice(-40))

  return { value, output, input, address: parsedAddress }
}

export const extractReturnTypeArgsData = (item: TReturnTypeArgs, memory: string[]) => {
  const { length, position } = item
  const output = getSafeHex(readMemory(memory, position, length))

  return { output }
}

export const extractCreateTypeArgsData = (item: TCreateTypeArgs, memory: string[]) => {
  const { value, byteCodeSize, byteCodePosition } = item

  const input = getSafeHex(readMemory(memory, byteCodePosition, byteCodeSize))

  const defaultReturn = { value: ethers.utils.formatEther(value), input }

  if ('salt' in item) return { ...defaultReturn, salt: item.salt }

  return defaultReturn
}
