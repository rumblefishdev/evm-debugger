import type { TIndexedStructLog } from './structLogs'
import type { TTraceLog } from './traceLogs'
import type { TAbi, TContractDissasembledBytecode, TDisassembledBytecode, TTransactionInfo } from './types'
import type { TYulBlock } from './yulSources'

export type TSourceData = {
  contractName?: string
  compilerVersion?: string
  optimizationUsed?: string
  runs?: string
  constructorArguments?: string
  evmVersion?: string
  library?: string
  licenseType?: string
  proxy?: string
  implementation?: string
  swarmSource?: string
}

export type TInputContractData = {
  address: string
  sourceMap?: string
  bytecode?: string
  etherscanBytecode?: string
  applicationBinaryInterface?: TAbi
  sourceCode?: string
  yulSource?: string
  yulTree?: TYulBlock
  sourceFilesOrder?: Record<number, string>
  sourceData?: TSourceData
}

export type TAnalyzerContractBaseData = {
  address: string
  name?: string
}

export type TAnalyzerContractSettings = {
  address: string
  compilerVersion?: string
  optimization?: { isEnabled: boolean; runs: number }
  evmVersion?: string
  license?: string
}

export type TSourceFile = {
  content: string
  path: string
  name: string
}

export type TAnalyzerContractData = {
  address: string
  contractBaseData?: TAnalyzerContractBaseData
  contractSettings?: TAnalyzerContractSettings
  disassembledBytecode?: TDisassembledBytecode
  disassembledEtherscanBytecode?: TDisassembledBytecode
  sourceFiles?: TSourceFile[]
}

export type TDataLoaderInputData = {
  transactionInfo: TTransactionInfo
  structLogs: TIndexedStructLog[]
  contracts: Record<string, TInputContractData>
}
export type TDataLoaderAnalyzerData = {
  structLogs: TIndexedStructLog[]
  transactionInfo: TTransactionInfo
  traceLogs: TTraceLog[]
  contracts: Record<string, TAnalyzerContractData>
}

export type TAnalyzerAnalysisOutput = {
  structLogs: TIndexedStructLog[]
  transactionInfo: TTransactionInfo
  traceLogs: TTraceLog[]
  contractsSettings: Record<string, TAnalyzerContractSettings>
  contractsBaseData: Record<string, TAnalyzerContractBaseData>
  contractsDisassembledBytecodes: Record<string, TContractDissasembledBytecode>
}
