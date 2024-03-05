import type { TCallTypeData, TOpcodesNames, TStorageLogs, TTraceLog } from '@evm-debuger/types'

import type { TParsedEventLog } from '../../types'

export type TParsedParams = {
  value: string
  type: string
  name: string
}

export type TBlockDefaultData = {
  value: string
  op: TOpcodesNames
  stackTrace: string
  passedGas: number
  gasCost: number
  blockNumber: string
  address: string
  isSuccess: boolean
  startIndex: number
  returnIndex: number
  storageLogs: TStorageLogs
  storageAddress: string
  isContract: boolean
  input: string
  output: string
  contractName: string | null
}
export type TBlockCallSpecificData = {
  parsedOutput: null | TParsedParams[]
  parsedInput: null | TParsedParams[]
  events: TParsedEventLog[]
  parsedError: null | TParsedParams[]
  functionSignature: null | string
  errorSignature: null | string
}
export type TBlockCreateSpecificData = {
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
