import type { ChainId } from './chains'
import type { TContractBytecodeObject } from './solc'
import type { TAbi } from './types'
import type { TYulBlock } from './yulSources'

export enum SrcMapStatus {
  SOURCE_DATA_FETCHING_QUEUED_PENDING = 'SOURCE_DATA_FETCHING_QUEUED_PENDING',
  SOURCE_DATA_FETCHING_QUEUED_FAILED = 'SOURCE_DATA_FETCHING_QUEUED_FAILED',
  SOURCE_DATA_FETCHING_QUEUED_SUCCESS = 'SOURCE_DATA_FETCHING_QUEUED_SUCCESS',
  SOURCE_DATA_FETCHING_QUEUED_TO_DLQ = 'SOURCE_DATA_FETCHING_QUEUED_TO_DLQ',
  SOURCE_DATA_FETCHING_PENDING = 'SOURCE_DATA_FETCHING_PENDING',
  SOURCE_DATA_FETCHING_FAILED = 'SOURCE_DATA_FETCHING_FAILED',
  SOURCE_DATA_FETCHING_NOT_VERIFIED = 'SOURCE_DATA_FETCHING_NOT_VERIFIED',
  SOURCE_DATA_FETCHING_SUCCESS = 'SOURCE_DATA_FETCHING_SUCCESS',
  FILES_EXTRACTING_PENDING = 'FILES_EXTRACTING_PENDING',
  FILES_EXTRACTING_FAILED = 'FILES_EXTRACTING_FAILED',
  FILES_EXTRACTING_SUCCESS = 'FILES_EXTRACTING_SUCCESS',
  COMPILATOR_TRIGGERRING_PENDING = 'COMPILATOR_TRIGERRING_PENDING',
  COMPILATOR_TRIGGERRING_FAILED = 'COMPILATOR_TRIGERRING_FAILED',
  COMPILATOR_TRIGGERRING_SUCCESS = 'COMPILATOR_TRIGERRING_SUCCESS',
  COMPILATION_PENDING = 'COMPILATION_PENDING',
  COMPILATION_FAILED = 'COMPILATION_FAILED',
  COMPILATION_SUCCESS = 'COMPILATION_SUCCESS',

  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  BUILDING = 'BUILDING',
  COMPILING = 'COMPILING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export enum SourceFileType {
  SOLIDITY = 'SOLIDITY',
  VYPER = 'VYPER',
  YUL = 'YUL',
  UNKNOWN = 'UNKNOWN',
}

export type TSrcMapAddres = {
  address: string
  chainId: ChainId
}

export type TSourceMap = {
  fileName: string
  contractName: string
  deployedBytecode: Pick<TContractBytecodeObject, 'object' | 'opcodes' | 'sourceMap'> & { ast: TYulBlock }
}

export type TEtherscanContractSourceCodeResult = {
  SourceCode: string
  ABI: TAbi
  ContractName: string
  CompilerVersion: string
  OptimizationUsed: string
  Runs: string
  ConstructorArguments: string
  EVMVersion: string
  Library: string
  LicenseType: string
  Proxy: string
  Implementation: string
  SwarmSource: string
}

export type TInputSources = Record<string, { content: string }>

export type TEtherscanParsedSourceCode = {
  language: string
  settings: {
    evmVersion?: string
    libraries?: Record<string, string>
    metadata?: {
      bytecodeHash: string
      useLiteralContent: boolean
    }
    optimizer: {
      enabled: boolean
      runs: number
    }
    remappings?: string[]
    viaIR?: boolean
    outputSelection?: {
      '*': {
        '*': string[]
      }
    }
  }
  sources: TInputSources
}

export type TSolcConfiguration = Pick<TEtherscanParsedSourceCode, 'language' | 'settings'> & {
  solcCompilerVersion: string
  rootContractName: string
}

export type TExtractedSourceFiles = [string, string][]

export type TEtherscanContractSourceCodeResp = {
  // https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes
  status: string
  message: string
  result: TEtherscanContractSourceCodeResult[]
}

export interface ISrcMapApiPayload {
  status: SrcMapStatus
  chainId: ChainId
  compilerVersion?: string
  address: string
  timestamp?: number
  message?: string
  pathSourceFiles?: string[]
  pathSourceMaps?: string[]
  pathSourceData?: string
  pathSources?: string
  pathCompilatorSettings?: string
}

export interface ISrcMapApiStatusResponse {
  status: SrcMapStatus
  chainId: ChainId
  address: string
  message?: string
  timestamp: number
}

export interface ISrcMapApiResponseBody {
  status: SrcMapStatus
  data?: Record<string, ISrcMapApiPayload>
  error?: string
}

export type TParsedSourceCode = {
  content: string
  sourceName: string
}

export type TParseSourceCodeOutput = Record<number, TParsedSourceCode>
export type TParsedSourceCodesOutput = Record<string, TParseSourceCodeOutput>

export type TSourceMapConverstionPayload = {
  sourceMap: string
  sourceFiles: TParseSourceCodeOutput
  opcodes: string
  contractName: string
  bytecode: string
  address: string
}

export type TSourceCodeObject = { sources: TInputSources }
