import type { IStructLog, TAbi, TTransactionInfo } from '@evm-debuger/types'

export interface IStructLogProvider {
  getStructLog: () => Promise<IStructLog[]>
}
export interface ITxInfoProvider {
  getTxInfo: () => Promise<TTransactionInfo>
}

export interface IAbiProvider {
  getAbi: (address: string) => Promise<TAbi | null>
}

export interface IBytecodeProvider {
  getBytecode: (address: string) => Promise<string | null>
}

export interface IRunAnalyzerPayload {
  structLogProvider: IStructLogProvider
  txInfoProvider: ITxInfoProvider
  abiProvider?: IAbiProvider
  bytecodeProvider?: IBytecodeProvider
}
