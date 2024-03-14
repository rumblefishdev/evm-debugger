import type { TIndexedStructLog, TRawStructLog } from './structLogs'
import type { TAbi, TDisassembledBytecode, TTransactionInfo } from './types'
import type { TYulBlock } from './yulSources'

export type TRawContractData = {
  address: string
  sourceMap?: string
  bytecode?: string
  etherscanBytecode?: string
  applicationBinaryInterface?: TAbi
  sourceCode?: string
  yulSource?: string
  yulTree?: TYulBlock
  sourceFilesOrder?: Record<number, string>
}

export type TContractBaseData = {
  address: string
  name?: string
}

export type TContractSettings = {
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

export type TContractData = TContractBaseData & {
  contractSettings?: TContractSettings
  disassembledBytecode?: TDisassembledBytecode
  disassembledEtherscanBytecode?: TDisassembledBytecode
  sourceFiles?: Record<number, TSourceFile>
}

export type TDataLoaderRawInputData = {
  transactionInfo: TTransactionInfo
  structLogs: TRawStructLog[]
  contracts: Record<string, TRawContractData>
}
export type TDataLoaderOutputData = {
  structLogs: TIndexedStructLog[]
  transactionInfo: TTransactionInfo
  contracts: Record<string, TContractData>
}

export type TAnalyzerAnalysisOutput = {
  structLogs: TIndexedStructLog[]
  transactionInfo: TTransactionInfo
  contractsSettings: Record<string, TContractSettings>
  contractsBaseData: Record<string, TContractBaseData>
  contractsDisassembledBytecodes: Record<string, { address: string; disassembledBytecode: TDisassembledBytecode }>
}
