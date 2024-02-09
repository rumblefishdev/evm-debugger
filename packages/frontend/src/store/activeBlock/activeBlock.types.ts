import type { AlternativeOpcodesHex, BaseOpcodesHex, TCallTypeData, TStorageLogs, TTraceLog } from '@evm-debuger/types'

import type { TParsedEventLog } from '../../types'

export type TParsedParams = {
  value: string
  type: string
  name: string
}

export type TBlockDefaultData = {
  value: string
  op: keyof typeof BaseOpcodesHex | keyof typeof AlternativeOpcodesHex
  stackTrace: string
  passedGas: number
  gasCost: number
  blockNumber: string
  address: string
  isSuccess: boolean
  startIndex: number
  returnIndex: number
}
export type TBlockCallSpecificData = {
  storageLogs: TStorageLogs
  storageAddress: string
  parsedOutput: null | TParsedParams[]
  parsedInput: null | TParsedParams[]
  events: TParsedEventLog[]
  parsedError: null | TParsedParams[]
  isContract: boolean
  functionSignature: null | string
  errorSignature: null | string
  input: string
  output: string
  contractName: string | null
}
export type TBlockCreateSpecificData = {
  storageLogs: TStorageLogs
  storageAddress: string
  input: string
  salt: string
}

export type TParsedCallTypeData = Omit<TCallTypeData, 'events'> & {
  events: TParsedEventLog[]
  parsedOutput: null | TParsedParams[]
  parsedInput: null | TParsedParams[]
  parsedError: null | TParsedParams[]
  errorSignature: null | string
  functionSignature: null | string
  contractName: string | null
}

export type TParsedActiveBlock = Omit<TTraceLog, 'stackTrace' | 'callTypeData'> & {
  stackTrace: string
  callTypeData: TParsedCallTypeData
}
