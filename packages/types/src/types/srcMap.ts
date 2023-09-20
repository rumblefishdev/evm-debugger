import type { ChainId } from './chains'
import type { TAbi } from './types'

export enum SrcMapStatus {
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

export type TSrcMapAddres = {
  address: string
  chainId: ChainId
}

export type TSourceMap = {
  contractName: string
  fileName: string
  rawSourceMap: string
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

export type TEtherscanParsedSourceCode = {
  language: string
  settings: {
    evmVersion: string
    libraries: Record<string, string>
    metadata: {
      bytecodeHash: string
      useLiteralContent: boolean
    }
    optimizer: {
      enabled: boolean
      runs: number
    }
    remappings: string[]
  }
  sources: Record<string, { content: string }>
}

export type TEtherscanContractSourceCodeResp = {
  // https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes
  status: string
  message: string
  result: TEtherscanContractSourceCodeResult[]
}

export interface ISrcMapApiPayload {
  status: SrcMapStatus
  chainId: ChainId
  address: string
  message?: string
  filesPath?: string[]
  sourceMaps?: TSourceMap[]
  sourceData?: TEtherscanContractSourceCodeResult
}

export interface ISrcMapApiResponseBody {
  status: SrcMapStatus
  data?: Record<string, ISrcMapApiPayload>
  error?: string
}
