import type { ChainId } from './chains'

export enum SrcMapStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  BUILDING = 'BUILDING',
  COMPILING = 'COMPILING',
  FAILED = 'FAILED',
  COMPILATION_FAILED = 'COMPILATION_FAILED',
  SOURCE_DATA_FETCHING_PENDING = 'SOURCE_DATA_FETCHING_PENDING',
  SOURCE_DATA_FETCHING_SUCCESS = 'SOURCE_DATA_FETCHING_SUCCESS',
  SOURCE_DATA_FETCHING_FAILED = 'SOURCE_DATA_FETCHING_FAILED',
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
  ABI: string
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

export type TEtherscanContractSourceCodeResp = {
  // https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes
  status: string
  message: string
  result: TEtherscanContractSourceCodeResult[]
}

export type TExtractedFile = string | null | undefined

export interface ISrcMapApiPayload {
  status: SrcMapStatus
  chainId: ChainId
  address: string
  message?: string
  files?: TExtractedFile[]
  sourceMaps?: TSourceMap[] | null
  sourceData?: TEtherscanContractSourceCodeResult
}

export interface ISrcMapCompilerPayload {
  compilerVersion: string
  files: TExtractedFile[]
}
