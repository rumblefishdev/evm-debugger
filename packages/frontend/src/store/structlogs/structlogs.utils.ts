import type { IStructLog, TMainTraceLogs } from '@evm-debuger/types'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import type { IExtendedStructLog } from '../../types'
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

export const createMockedStructlog = (index: number): IStructLog => ({
  storage: {},
  stack: [],
  pc: index,
  op: 'CALL',
  memory: [],
  index,
  gasCost: 0,
  gas: 0,
  depth: 0,
})

export const createMockedStructLogs = (length: number): IStructLog[] => {
  const structLogs: IStructLog[] = []

  for (let index = 0; index < length; index++) {
    structLogs.push(createMockedStructlog(index))
  }

  return structLogs
}
