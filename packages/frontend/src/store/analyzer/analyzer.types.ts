import type { IStructLog, TAbi, TSourceMap, TTransactionInfo } from '@evm-debuger/types'

export interface IStructLogProvider {
  getStructLog: () => Promise<IStructLog[]>
}
export interface ITxInfoProvider {
  getTxInfo: () => Promise<TTransactionInfo>
}

export type TContractsSources = Record<
  string,
  {
    contractName: string
    sourceCode: string
    abi: TAbi
    srcMap: TSourceMap[]
  }
>
export interface IContractSourceProvider {
  getSources: (addresses: Set<string>) => Promise<TContractsSources | null>
}

export interface IBytecodeProvider {
  getBytecode: (address: string) => Promise<string | null>
}

export interface IRunAnalyzerPayload {
  structLogProvider: IStructLogProvider
  txInfoProvider: ITxInfoProvider
  sourceProvider?: IContractSourceProvider
  bytecodeProvider?: IBytecodeProvider
}

export type TAnalyzeStageName =
  | 'Fetching transaction info'
  | 'Fetching structlogs'
  | 'Run analyzer'
  | 'Trying to fetch missing data'
  | 'ReRun analyzer'

export type TAnalyzeStage = {
  stageName: TAnalyzeStageName
  isFinished: boolean
}
