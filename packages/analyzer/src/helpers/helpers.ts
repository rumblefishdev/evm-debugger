/* eslint-disable sonarjs/cognitive-complexity */
import type { BytesLike } from 'ethers'
import { getBytes, toBeHex, AbiCoder, formatEther, getCreateAddress } from 'ethers'
import type {
  ICallTypeStructLogs,
  ICallTypeTraceLog,
  ICreateTypeStructLogs,
  ICreateTypeTraceLog,
  IFilteredStructLog,
  ILogTypeStructLogs,
  IReturnTypeStructLogs,
  IReturnTypeTraceLog,
  TIndexedStructLog,
  TMainTraceLogs,
  TRawStructLog,
  TReturnedTraceLog,
  TTraceLog,
  TTransactionInfo,
} from '@evm-debuger/types'
import { FunctionBlockStartOpcodes, FunctionBlockEndOpcodes, BaseOpcodesHex } from '@evm-debuger/types'

import { OpcodesNamesArray } from '../constants/constants'
import { BUILTIN_ERRORS } from '../resources/builtinErrors'

import { checkOpcodeIfOfFunctionBlockEndType } from './structLogTypeGuards'

export const getFilteredStructLogs = (structLogs: TIndexedStructLog[]): IFilteredStructLog[] => {
  const filteredLogs = []
  structLogs.forEach((log, index) => {
    const { op } = log
    if (OpcodesNamesArray.includes(op)) filteredLogs.push({ ...log, index })
  })

  return filteredLogs
}

export const indexRawStructLogs = (structLogs: TRawStructLog[]): TIndexedStructLog[] => {
  return structLogs.map((log, index) => ({ ...log, index }))
}

export const getFunctionBlockStartStructLogs = (structLogs: TIndexedStructLog[]): TIndexedStructLog[] => {
  return structLogs.filter((log) => Boolean(FunctionBlockStartOpcodes.includes(BaseOpcodesHex[log.op])))
}

export const getFunctionBlockEndStructLogs = (structLogs: TIndexedStructLog[]): TIndexedStructLog[] => {
  return structLogs.filter((log) => Boolean(FunctionBlockEndOpcodes.includes(BaseOpcodesHex[log.op])))
}

export const readMemory = (memory: string[], rawStart: string, rawLength: string): string => {
  const start = Number.parseInt(rawStart, 16)
  const length = Number.parseInt(rawLength, 16)

  const memoryString = memory.join('')

  const readStartIndex = start * 2
  const readEndIndex = readStartIndex + length * 2

  return memoryString.slice(readStartIndex, readEndIndex)
}

export const checkIfOfCallType = (
  item: TReturnedTraceLog | Omit<TIndexedStructLog, 'stack'>,
): item is ICallTypeTraceLog | ICallTypeStructLogs => {
  if ('type' in item) return item.type === 'CALL' || item.type === 'CALLCODE' || item.type === 'DELEGATECALL' || item.type === 'STATICCALL'

  return item.op === 'CALL' || item.op === 'CALLCODE' || item.op === 'DELEGATECALL' || item.op === 'STATICCALL'
}

export const checkIfOfCreateType = (
  item: TReturnedTraceLog | Omit<TIndexedStructLog, 'stack'>,
): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
  if ('type' in item) return item.type === 'CREATE' || item.type === 'CREATE2'

  return item.op === 'CREATE' || item.op === 'CREATE2'
}

export const checkIfOfCreateOrCallType = (item: TReturnedTraceLog | Omit<TIndexedStructLog, 'stack'>): item is TMainTraceLogs => {
  return checkIfOfCallType(item) || checkIfOfCreateType(item)
}

export const checkIfOfDelegateCallType = (
  item: TReturnedTraceLog | IFilteredStructLog,
): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
  if ('type' in item) return item.type === 'DELEGATECALL'

  return item.op === 'DELEGATECALL'
}

export const checkIfOfCallOrStaticCallType = (
  item: TReturnedTraceLog | IFilteredStructLog,
): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
  if ('type' in item) return item.type === 'CALL' || item.type === 'STATICCALL'

  return item.op === 'CALL' || item.op === 'STATICCALL'
}

export const checkIfOfReturnType = (item: TReturnedTraceLog | IFilteredStructLog): item is IReturnTypeTraceLog | IReturnTypeStructLogs => {
  if ('type' in item) return item.type === 'RETURN' || item.type === 'REVERT'

  return item.op === 'RETURN' || item.op === 'REVERT'
}

export const isLogType = (item: TIndexedStructLog): item is ILogTypeStructLogs => {
  return item.op === 'LOG0' || item.op === 'LOG1' || item.op === 'LOG2' || item.op === 'LOG3' || item.op === 'LOG4'
}

export const safeJsonParse = (text: string): any | null => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export const getSafeHex = (value: string | undefined) => (value ? `0x${value}` : `0x`)

export const decodeErrorResult = (data: BytesLike) => {
  const bytes = getBytes(data)

  const selectorSignature = toBeHex(bytes.slice(0, 4).toString())

  const builtin = BUILTIN_ERRORS[selectorSignature]

  if (builtin) return new AbiCoder().decode(builtin.inputs, bytes.slice(4))
}

export const selectFunctionBlockContextForLog = <T extends TIndexedStructLog | TTraceLog>(
  structLogs: T[],
  log: TIndexedStructLog | TTraceLog,
): T[] => {
  const { depth, index } = log
  const context = structLogs.slice(index + 1)
  const lastElement = context.find((contextLog) => contextLog.depth === depth)

  return lastElement === undefined ? context : structLogs.slice(index + 1, lastElement.index)
}

export const selectFirstStructLogOnSameDepth = (structLogs: TIndexedStructLog[], structLog: TIndexedStructLog) => {
  const currentBlockContenxt = selectFunctionBlockContextForLog<TIndexedStructLog>(structLogs, structLog)
  const lastElementInCurrentBlockContext = currentBlockContenxt.at(-1)

  return structLogs[lastElementInCurrentBlockContext.index + 1]
}

export const selectLastStructLogInFunctionBlockContext = (structLogs: TIndexedStructLog[], log: TIndexedStructLog | TTraceLog) => {
  const currentBlockContenxt = selectFunctionBlockContextForLog<TIndexedStructLog>(structLogs, log)
  return currentBlockContenxt.at(-1)
}

// export const prepareTraceToSearch = (
//   logs: TTraceLog[] | TIndexedStructLog[],
//   currentIndex: number,
//   depth: number,
//   inclusiveLastElement: boolean,
// ) => {
//   const slicedTraceLogs = logs.slice(currentIndex + 1)
//   let maxLastCallIndex = slicedTraceLogs.findIndex((log) => log.depth === depth)
//   maxLastCallIndex = inclusiveLastElement ? maxLastCallIndex + 1 : maxLastCallIndex
//   return maxLastCallIndex === -1 ? slicedTraceLogs : slicedTraceLogs.slice(0, maxLastCallIndex)
// }

export const getPcIndexedStructlogsForContractAddress = (traceLogs: TTraceLog[], structLogs: TIndexedStructLog[], address: string) => {
  const traceLogsForAddress = traceLogs
    .filter((traceLog) => checkOpcodeIfOfFunctionBlockEndType(traceLog.op))
    .filter((log) => log.address === address)
  const structLogsForAddress = traceLogsForAddress
    .map((log) => structLogs.slice(log.startIndex, log.returnIndex + 1).filter((structlog) => structlog.depth === log.depth + 1))
    .flat()

  return structLogsForAddress.reduce((accumulator, log) => {
    if (!accumulator[log.pc]) accumulator[log.pc] = []
    accumulator[log.pc].push(log)
    return accumulator
  }, {} as Record<number, TIndexedStructLog[]>)
}

export const getLastLogWithRevertType = (traceToSearch: TTraceLog[], depth: number) => {
  return traceToSearch.find((iteratedItem) => iteratedItem.depth === depth + 1 && iteratedItem.op === 'REVERT')
}

export const getStorageAddressFromTransactionInfo = (txInfo: TTransactionInfo) => {
  const { nonce, to, from } = txInfo
  return to || getCreateAddress({ nonce, from })
}

export const convertTxInfoToTraceLog = (firstNestedStructLog: TIndexedStructLog, txInfo: TTransactionInfo): TTraceLog => {
  const { to, input, value, blockNumber } = txInfo

  const storageAddress = getStorageAddressFromTransactionInfo(txInfo)

  return {
    value: formatEther(value),
    storageAddress,
    startIndex: 0,
    stackTrace: [],
    pc: 0,
    passedGas: firstNestedStructLog.gas,
    op: to ? 'CALL' : 'CREATE',
    isContract: true,
    input,
    index: 0,
    gasCost: 0,
    depth: 0,
    createTypeData: to ? undefined : { salt: undefined },
    callTypeData: to ? { output: '0x', events: [] } : undefined,
    blockNumber,
    address: to ? to.toLowerCase() : storageAddress,
  }
}

export const isMultipleFilesJSON = (sourceCode: string) => sourceCode.startsWith('{{') && sourceCode.endsWith('}}')

export const removeEncapsulation = (sourceCode: string) => {
  return sourceCode.slice(1, -1).replace(/"/g, "'")
}
