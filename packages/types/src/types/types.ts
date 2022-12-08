import type { ethers } from 'ethers'

import type { IStructLog } from './structLogs'

export type TStorage = Record<string, string>

export type TLoadedStorage = { key: string; value: string; index: number }[]
export type TChangedStorage = { key: string; initialValue: string; updatedValue: string; index: number }[]
export type TReturnedStorage = { key: string; value: string }[]

export type TStorageLogs = {
  loadedStorage: TLoadedStorage
  returnedStorage: TReturnedStorage
  changedStorage: TChangedStorage
  isReverted?: boolean
}

export type TTransactionInfo = {
  blockHash: string
  blockNumber: string
  from: string
  gas: string
  hash: string
  input: string
  nonce: string
  to: string
  transactionIndex: string
  value: string
  v: string
  r: string
  s: string
  type: string
  accessList: string
  chainId: string
  gasPrice: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
}

export type TTransactionTraceResult = {
  gas: number
  failed: boolean
  returnValue: string
  structLogs: IStructLog[]
}

export type TTransactionTrace = {
  jsonrpc: string
  id: number
  result: TTransactionTraceResult
}

export interface TDataProvider {
  getTransactionTrace: (transactionHash: string) => Promise<TTransactionTraceResult>
  getTransactionByHash: (transactionHash: string) => Promise<TTransactionInfo>
  getContractCode: (address: string) => Promise<string>
  fetchAbiCode: (address: string) => Promise<string>
}

export interface IErrorDescription {
  readonly errorFragment: ethers.utils.ErrorFragment
  readonly name: string
  readonly args: ethers.utils.Result
  readonly signature: string
  readonly sighash: string
}

export type TFragmentStoreTypes = 'function' | 'event' | 'error'
export type TFragmentStore = Record<TFragmentStoreTypes, ethers.utils.Fragment>

export interface IFragmentDecodeResult {
  readonly functionDescription: ethers.utils.TransactionDescription | null
  readonly errorDescription: IErrorDescription | null
  readonly decodedOutput: ethers.utils.Result | null
  readonly decodedInput: ethers.utils.Result | null
}

export interface ContractAddress {
  index: number,
  address: string
}
