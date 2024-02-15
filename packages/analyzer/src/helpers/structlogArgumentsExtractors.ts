import { formatEther } from 'ethers'
import { BaseOpcodesHex, OpcodesArguments } from '@evm-debuger/types'
import type {
  TIndexedStructLog,
  TCallGroupOpcodesArgumentNames,
  TCreateGroupOpcodesArgumentNames,
  TReturnGroupTypeOpcodesArgumentNames,
  TTraceReturnLog,
  ILogGroupTypeOpcodesArgumentNames,
} from '@evm-debuger/types'

import { getSafeHex, readMemory } from './helpers'

export const extractLogTypeArgsData = (item: ILogGroupTypeOpcodesArgumentNames) => {
  const { offset, size, topic1, topic2, topic3, topic4 } = item

  const logDataOffset = getSafeHex(offset)
  const logDataLength = getSafeHex(size)

  const extractedTopics = [topic1, topic2, topic3, topic4].filter(Boolean).map((topic) => getSafeHex(topic))

  return { topics: extractedTopics, logDataOffset, logDataLength }
}

export const extractCallTypeArgsData = (item: TCallGroupOpcodesArgumentNames, memory: string[]) => {
  // IF CALL OR CALLCODE THEN ENSURE THAT VALUE IS EXTRACTED
  const rawValue = 'value' in item ? getSafeHex(item.value) : '0x0'
  const value = formatEther(rawValue)

  const { address, argsSize, argsOffset, returnSize, returnOffset } = item

  const input = getSafeHex(readMemory(memory, argsOffset, argsSize))

  const output = getSafeHex(readMemory(memory, returnOffset, returnSize))

  const parsedAddress = getSafeHex(address.slice(-40)).toLowerCase()

  return { value, output, input, address: parsedAddress }
}

export const extractReturnTypeArgsData = (item: TReturnGroupTypeOpcodesArgumentNames, memory: string[]) => {
  const { offset, size } = item
  const output = getSafeHex(readMemory(memory, offset, size))

  return { output }
}

export const extractCreateTypeArgsData = (item: TCreateGroupOpcodesArgumentNames, memory: string[]) => {
  const { value, size, offset } = item

  const input = getSafeHex(readMemory(memory, offset, size))

  const defaultReturn = { value: formatEther(value), input }

  if ('salt' in item) return { ...defaultReturn, salt: item.salt }

  return defaultReturn
}

export const extractStackByteWords = <T>(stack: string[], op: string): T => {
  const opCodeArgumentsNames: string[] = OpcodesArguments[BaseOpcodesHex[op]]

  return opCodeArgumentsNames.reduce((accumulator, argumentName, index) => {
    accumulator[argumentName] = stack[stack.length - index - 1]
    return accumulator
  }, {} as T)
}

export const getLogGroupTypeOpcodesArgumentsData = (structLog: TIndexedStructLog) => {
  const { stack, op } = structLog

  const opCodeArguments = extractStackByteWords<ILogGroupTypeOpcodesArgumentNames>(stack, op)

  return extractLogTypeArgsData(opCodeArguments)
}

export const getCallGroupOpcodesArgumentsData = (structLog: TIndexedStructLog) => {
  const { stack, op, memory } = structLog

  const opCodeArguments = extractStackByteWords<TCallGroupOpcodesArgumentNames>(stack, op)

  return extractCallTypeArgsData(opCodeArguments, memory)
}

export const getCreateGroupOpcodesArgumentsData = (structLog: TIndexedStructLog) => {
  const { stack, op, memory } = structLog

  const opCodeArguments = extractStackByteWords<TCreateGroupOpcodesArgumentNames>(stack, op)

  return extractCreateTypeArgsData(opCodeArguments, memory)
}

export const getReturnGroupTypeOpcodesArgumentsData = (structLog: TIndexedStructLog): Pick<TTraceReturnLog, 'output'> => {
  const { stack, op, memory } = structLog

  const opCodeArguments = extractStackByteWords<TReturnGroupTypeOpcodesArgumentNames>(stack, op)

  if (Object.keys(opCodeArguments).length === 0) return { output: '0x' }

  return extractReturnTypeArgsData(opCodeArguments, memory)
}
