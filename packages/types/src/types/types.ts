import type { FunctionFragment, ErrorFragment, EventFragment, Result, LogDescription, ErrorDescription } from 'ethers'
import type { JsonFragment } from '@ethersproject/abi'

import type { TRawStructLog, TIndexedStructLog } from './structLogs'
import type { ChainId } from './chains'
import type { SourceFileType, TSourceMap } from './srcMap'
import type { TOpcodesNames } from './opcodes/opcodesHex'

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
  gasLimit?: string
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
  structLogs: TRawStructLog[]
}

export interface TTransactionTraceResult extends TRawTransactionTraceResult {
  structLogs: TRawStructLog[]
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

export type TDisassembledBytecodeStructlog = {
  pc: number
  opcode: TOpcodesNames
  index: number
  value?: string
}

export type TDisassembledBytecode = Record<number, TDisassembledBytecodeStructlog>

export type TContractDissasembledBytecode = {
  address: string
  disassembledBytecode: TDisassembledBytecode
}

export type TSourceMapCodeRepresentation = {
  startCodeLine: number
  endCodeLine: number
  fileType: SourceFileType
  startColumn: number
  endColumn: number
  isSourceFunction?: boolean
  isYulFunction?: boolean
  sourceFunctionName?: string
  sourceFunctionSingature?: string
  sourceFunctionParameters?: { name: string; type: string; modifiers: string[] }[]
}

export type TSighashFragment = JsonFragment
export type TAbi = readonly TSighashFragment[]
export type TAbis = Record<string, TAbi>
export type TAddressToBytecodeDictionary = Record<string, string>
export type TStepInstruction = TParsedSourceMap & TOpcodeFromSourceMap & TSourceMapCodeRepresentation
export type TPcIndexedStepInstructions = Record<number, TStepInstruction>

export type TMappedSourceCodes = Record<string, string>
export type TMappedSourceMap = Record<string, TSourceMap[]>
export type TAddressToContractNameDictionary = Record<string, string>
export type TStructlogsPerStartLine = Record<number, Record<number, TIndexedStructLog[]>>
export type TStepInstrctionsMap = Record<
  string,
  { instructions: TPcIndexedStepInstructions; structlogsPerStartLine: TStructlogsPerStartLine }
>

export type TContractRawData = {
  address: string
  applicationBinaryInterface?: string
  bytecode?: string
  sourceFiles?: string[]
  sourceMap?: string
}

export type TAnalyzerContractBaseOutput = {
  address: string
  contractName?: string
}

export type TAnalyzerContractBytecodeOutput = {
  address: string
  bytecode?: string
  etherscanBytecode?: string
  dissasembledBytecode?: TDisassembledBytecode
  dissasembledEtherscanBytecode?: TDisassembledBytecode
}

export type TAnalyzerContractsDataOutput = {
  address: string
  name?: string
  bytecode: TAnalyzerContractBytecodeOutput
}

export type TSighashStatus = {
  sighash: string
  addresses: Set<string>
  fragment: TSighashFragment | null
  found: boolean
}
