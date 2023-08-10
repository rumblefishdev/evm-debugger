import type { ethers } from 'ethers'
import type { JsonFragment } from '@ethersproject/abi'

import type { IStructLog } from './structLogs'
import { ChainId } from './chains'

export type TStorage = Record<string, string>

export type TLoadedStorage = { key: string; value: string; index: number }[]
export type TChangedStorage = {
  key: string
  initialValue: string
  updatedValue: string
  index: number
}[]
export type TReturnedStorage = { key: string; value: string }[]

export type TStorageLogs = {
  loadedStorage: TLoadedStorage
  returnedStorage: TReturnedStorage
  changedStorage: TChangedStorage
  isReverted?: boolean
}

export type TTransactionInfo = {
  blockNumber: string
  blockHash?: string
  from: string
  hash: string
  input?: string
  to?: string
  value: string
  chainId: string
  nonce: number
}

export type TTransactionTraceResult = {
  gas: number
  failed: boolean
  returnValue: string
  structLogs: IStructLog[]
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
export type TFragmentStore = {
  function: Record<string, ethers.utils.FunctionFragment>
  event: Record<string, ethers.utils.EventFragment>
  error: Record<string, ethers.utils.ErrorFragment>
}

export interface IFragmentDecodeResult {
  readonly functionFragment: ethers.utils.FunctionFragment
  readonly errorDescription: IErrorDescription | null
  readonly decodedOutput: ethers.utils.Result | null
  readonly decodedInput: ethers.utils.Result | null
}

export type TEventInfo = {
  eventDescription: ethers.utils.LogDescription
  decodedEvent: ethers.utils.Result
}

export type TSighashFragment = JsonFragment
export type TAbi = readonly TSighashFragment[]
export type TAbis = Record<string, TAbi>
export type TSourceCodesMap = Record<string, string>
export type TContractNamesMap = Record<string, string>

export type TContractData = {
  abi: TAbi
  sourceCode: string
  contractName: string
}

export type TContractDataByAddress = Record<string, TContractData>

export type TTransactionData = {
  structLogs: IStructLog[]
  transactionInfo: TTransactionInfo
  abis: TAbis
  sourceCodes: TSourceCodesMap
  contractNames: TContractNamesMap
}

export type TSighashStatus = {
  sighash: string
  addresses: Set<string>
  fragment: TSighashFragment | null
  found: boolean
}
