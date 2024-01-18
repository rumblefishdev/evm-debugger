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
  IStopTypeTraceLog,
  IStructLog,
  TMainTraceLogs,
  TReturnedTraceLog,
  TTransactionInfo,
} from '@evm-debuger/types'

import { BuiltinErrors, OpcodesNamesArray } from '../constants/constants'

export const getFilteredStructLogs = (structLogs: IStructLog[]): IFilteredStructLog[] => {
  const filteredLogs = []
  structLogs.forEach((log, index) => {
    const { op } = log
    if (OpcodesNamesArray.includes(op)) filteredLogs.push({ ...log, index })
  })

  return filteredLogs
}

export const readMemory = (memory: string[], rawStart: string, rawLength: string): string => {
  const start = Number.parseInt(rawStart, 16)
  const length = Number.parseInt(rawLength, 16)

  const memoryString = memory.join('')

  const readStartIndex = start * 2
  const readEndIndex = readStartIndex + length * 2

  return memoryString.slice(readStartIndex, readEndIndex)
}

export const checkIfOfCallType = (item: TReturnedTraceLog | Omit<IStructLog, 'stack'>): item is ICallTypeTraceLog | ICallTypeStructLogs => {
  if ('type' in item) return item.type === 'CALL' || item.type === 'CALLCODE' || item.type === 'DELEGATECALL' || item.type === 'STATICCALL'

  return item.op === 'CALL' || item.op === 'CALLCODE' || item.op === 'DELEGATECALL' || item.op === 'STATICCALL'
}

export const checkIfOfCreateType = (
  item: TReturnedTraceLog | Omit<IStructLog, 'stack'>,
): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
  if ('type' in item) return item.type === 'CREATE' || item.type === 'CREATE2'

  return item.op === 'CREATE' || item.op === 'CREATE2'
}

export const checkIfOfCreateOrCallType = (item: TReturnedTraceLog | Omit<IStructLog, 'stack'>): item is TMainTraceLogs => {
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

export const isLogType = (item: IStructLog): item is ILogTypeStructLogs => {
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

  const builtin = BuiltinErrors[selectorSignature]

  if (builtin) return new AbiCoder().decode(builtin.inputs, bytes.slice(4))
}

export const prepareTraceToSearch = (
  logs: TReturnedTraceLog[] | IStructLog[],
  currentIndex: number,
  depth: number,
  inclusiveLastElement: boolean,
) => {
  const slicedTraceLogs = logs.slice(currentIndex + 1)
  let maxLastCallIndex = slicedTraceLogs.findIndex((log) => log.depth === depth)
  maxLastCallIndex = inclusiveLastElement ? maxLastCallIndex + 1 : maxLastCallIndex
  return maxLastCallIndex === -1 ? slicedTraceLogs : slicedTraceLogs.slice(0, maxLastCallIndex)
}

export const getNextItemOnSameDepth = (traceLogs: IStructLog[], currentIndex: number, depth: number): IStructLog => {
  const traceToSearch = prepareTraceToSearch(traceLogs, currentIndex, depth, true)
  return traceToSearch.at(-1) as IStructLog
}

export const getLastItemInCallTypeContext = (traceLogs: TReturnedTraceLog[], currentIndex: number, depth: number) => {
  const traceToSearch = prepareTraceToSearch(traceLogs, currentIndex, depth, false) as TReturnedTraceLog[]

  return traceToSearch.find(
    (iteratedItem) =>
      iteratedItem.depth === depth + 1 &&
      (iteratedItem.type === 'RETURN' || iteratedItem.type === 'REVERT' || iteratedItem.type === 'STOP'),
  ) as IReturnTypeTraceLog | IStopTypeTraceLog
}

export const getLastLogWithRevertType = (traceToSearch: TReturnedTraceLog[], depth: number) => {
  return traceToSearch.find((iteratedItem) => iteratedItem.depth === depth + 1 && iteratedItem.type === 'REVERT') as IReturnTypeTraceLog
}

export const getStorageAddressFromTransactionInfo = (txInfo: TTransactionInfo) => {
  const { nonce, to, from } = txInfo
  return to || getCreateAddress({ nonce, from })
}

export const convertTxInfoToTraceLog = (firstNestedStructLog: IStructLog, txInfo: TTransactionInfo) => {
  const { to, input, value, blockNumber } = txInfo

  const storageAddress = getStorageAddressFromTransactionInfo(txInfo)

  const defaultFields = {
    value: formatEther(value),
    type: 'CALL',
    storageAddress,
    startIndex: 0,
    stackTrace: [] as number[],
    pc: 0,
    passedGas: firstNestedStructLog.gas,
    input,
    index: 0,
    gasCost: 0,
    depth: 0,
    blockNumber,
  } as ICallTypeTraceLog | ICreateTypeTraceLog

  if (to)
    return {
      ...defaultFields,
      address: to.toLowerCase(),
    } as ICallTypeTraceLog

  return {
    ...defaultFields,
    type: 'CREATE',
  } as ICreateTypeTraceLog
}

export const isMultipleFilesJSON = (sourceCode: string) => sourceCode.startsWith('{{') && sourceCode.endsWith('}}')

export const removeEncapsulation = (sourceCode: string) => {
  return sourceCode.slice(1, -1).replace(/"/g, "'")
}
