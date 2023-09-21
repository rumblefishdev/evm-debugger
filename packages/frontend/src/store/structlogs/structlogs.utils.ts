import type { IStructLog, TMainTraceLogs } from '@evm-debuger/types'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import type { IExtendedStructLog, TExtendedStack } from '../../types'
import { extendStack } from '../../helpers/helpers'
import { argStackExtractor } from '../../helpers/argStackExtractor'

export const getParsedStructLogs = (
  structLogs: IStructLog[],
  traceLogs: TMainTraceLogs[],
  startIndex: number,
  returnIndex: number,
): IExtendedStructLog[] => {
  return structLogs
    .slice(startIndex, returnIndex + 1)
    .filter((item) => item.depth === structLogs[startIndex].depth)
    .map((item, index) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item))
        return {
          ...argStackExtractor(item),
          stack: extendStack(item.stack),
          index,
          gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)?.gasCost,
        }

      return {
        ...argStackExtractor(item),
        stack: extendStack(item.stack),
        index,
      }
    })
}

export const getParsedStack = (stack: TExtendedStack) => {
  return stack
    .map((stackItem, index) => {
      const defaultString = '0000'
      const hexValue = (stack.length - 1 - index).toString()
      const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue

      return { value: stackItem, index: paddedHexValue }
    })
    .reverse()
}

export const getParsedMemory = (memory: string[]) => {
  return memory.map((memoryItem, index) => {
    const defaultString = '0000'
    const hexValue = (index * 32).toString(16)
    const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue
    const splitMemoryItem = [...memoryItem.match(/.{1,2}/g)]

    return { value: splitMemoryItem, index: paddedHexValue }
  })
}
