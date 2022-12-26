import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import type { JsonFragment } from '@ethersproject/abi'

export interface IStructLogProvider {
  getStructLog: () => Promise<IStructLog[]>
}
export interface ITxInfoProvider {
  getTxInfo: () => Promise<TTransactionInfo>
}

export interface IAbiProvider {
  getAbi: (address: string) => Promise<JsonFragment | null>
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
