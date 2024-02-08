import type { FunctionFragment, ErrorFragment, EventFragment, Result, LogDescription, ErrorDescription } from 'ethers'
import type { JsonFragment } from '@ethersproject/abi'

import type { IRawStructLog, IStructLog } from './structLogs'
import type { ChainId } from './chains'
import type { SourceFileType, TParsedSourceCodesOutput, TSourceMap } from './srcMap'
import type { TIndexedStructLog } from './structLogs2'

export type TStorage = Record<string, string>

export type TLoadedStorage = { key: string; value: string; index: number }[]
export type TChangedStorage = {
  key: string
  initialValue: string
  updatedValue: string
  index: number
}[]
export type TReturnedStorage = { key: string; value: string }[]

export type TStorageLogs = {
  loadedStorage: TLoadedStorage
  returnedStorage: TReturnedStorage
  changedStorage: TChangedStorage
  isReverted?: boolean
}

export type TTransactionInfo = {
  blockNumber: string
  blockHash?: string
  from: string
  hash: string
  input?: string
  to?: string
  value: string
  chainId: ChainId
  nonce: number
}

export interface TRawTransactionTraceResult {
  gas: number
  failed: boolean
  returnValue: string
  structLogs: IRawStructLog[]
}

export interface TTransactionTraceResult extends TRawTransactionTraceResult {
  structLogs: IStructLog[]
}

export interface TDataProvider {
  getTransactionTrace: (transactionHash: string) => Promise<TTransactionTraceResult>
  getTransactionByHash: (transactionHash: string) => Promise<TTransactionInfo>
  getContractCode: (address: string) => Promise<string>
  fetchAbiCode: (address: string) => Promise<string>
}

export type TFragmentStoreTypes = 'function' | 'event' | 'error'
export type TFragmentStore = {
  function: Record<string, FunctionFragment>
  event: Record<string, EventFragment>
  error: Record<string, ErrorFragment>
}

export interface IFragmentDecodeResult {
  readonly functionFragment: FunctionFragment
  readonly errorDescription: ErrorDescription | null
  readonly decodedOutput: Result | null
  readonly decodedInput: Result | null
}

export type TEventInfo = {
  eventDescription: LogDescription
  decodedEvent: Result
}

export type TParsedSourceMap = {
  offset: number
  length: number
  fileId: number
  jumpType: string
}

export type TOpcodeFromSourceMap = {
  pc: number
  opcode: string
}

export type TSourceMapCodeRepresentation = { startCodeLine: number; endCodeLine: number; fileType: SourceFileType }

export type TSighashFragment = JsonFragment
export type TAbi = readonly TSighashFragment[]
export type TAbis = Record<string, TAbi>
export type TByteCodeMap = Record<string, string>
export type TStepInstruction = TParsedSourceMap & TOpcodeFromSourceMap & TSourceMapCodeRepresentation
export type TPcIndexedStepInstructions = Record<number, TStepInstruction>

export type TMappedSourceCodes = Record<string, string>
export type TMappedSourceMap = Record<string, TSourceMap[]>
export type TMappedContractNames = Record<string, string>
export type TStructlogsPerStartLine = Record<number, Record<number, IStructLog[]>>
export type TStepInstrctionsMap = Record<
  string,
  { instructions: TPcIndexedStepInstructions; structlogsPerStartLine: TStructlogsPerStartLine }
>

export type TContractData = {
  abi: TAbi
  sourceCode: string
  contractName: string
}

export type TContractDataByAddress = Record<string, TContractData>

export type TTransactionData = {
  structLogs: TIndexedStructLog[]
  transactionInfo: TTransactionInfo
  abis: TAbis
  sourceFiles: TParsedSourceCodesOutput
  sourceMaps: TMappedSourceMap
  bytecodeMaps: TByteCodeMap
  contractNames: TMappedContractNames
}

export type TSighashStatus = {
  sighash: string
  addresses: Set<string>
  fragment: TSighashFragment | null
  found: boolean
}
