import { formatEther, getCreateAddress } from 'ethers'
import type { TDisassembledBytecode, TIndexedStructLog, TTraceLog, TTransactionInfo } from '@evm-debuger/types'
import { FunctionBlockStartOpcodes, FunctionBlockEndOpcodes, BaseOpcodesHex } from '@evm-debuger/types'

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

export const getSafeHex = (value: string | undefined) => (value ? `0x${value}` : `0x`)

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

export const getPcIndexedStructlogsForContractAddress = (traceLogs: TTraceLog[], structLogs: TIndexedStructLog[], address: string) => {
  const traceLogsForAddress = traceLogs.filter((log) => log.address === address)

  const structLogsForAddress = traceLogsForAddress
    .map((log) => structLogs.slice(log.startIndex, log.returnIndex + 1).filter((structlog) => structlog.depth === log.depth + 1))
    .flat()

  return structLogsForAddress.reduce((accumulator, log) => {
    if (!accumulator[log.pc]) accumulator[log.pc] = []
    accumulator[log.pc].push(log)
    return accumulator
  }, {} as Record<number, TIndexedStructLog[]>)
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
    output: '0x',
    op: to ? 'CALL' : 'CREATE',
    isContract: true,
    input,
    index: 0,
    gasCost: 0,
    depth: 0,
    createTypeData: to ? undefined : { salt: undefined },
    callTypeData: to ? { events: [] } : undefined,
    blockNumber,
    address: to ? to.toLowerCase() : storageAddress,
  }
}
