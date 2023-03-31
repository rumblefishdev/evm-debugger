import type { IStructLog, TAbi, TTransactionInfo } from '@evm-debuger/types'

export interface IStructLogProvider {
  getStructLog: () => Promise<IStructLog[]>
}
export interface ITxInfoProvider {
  getTxInfo: () => Promise<TTransactionInfo>
}

export interface ISourceProvider {
  getSource: (address: string) => Promise<{
    contractName: string
    sourceCode: string
    abi: TAbi
  } | null>
}

export interface IBytecodeProvider {
  getBytecode: (address: string) => Promise<string | null>
}

export interface IRunAnalyzerPayload {
  structLogProvider: IStructLogProvider
  txInfoProvider: ITxInfoProvider
  sourceProvider?: ISourceProvider
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
