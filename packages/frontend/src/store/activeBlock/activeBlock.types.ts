import type {
  TCallTypeOpcodes,
  TCreateTypeOpcodes,
  TStorageLogs,
} from '@evm-debuger/types'

import type { TParsedEventLog } from '../../types'

export type TParsedParams = {
  value: string
  type: string
  name: string
}

export type TBlockDefaultData = {
  value: string
  type: TCallTypeOpcodes | TCreateTypeOpcodes
  stackTrace: string
  passedGas: number
  gasCost: number
  blockNumber: string
  address: string
  isSuccess: boolean
}
export type TBlockCallSpecificData = {
  storageLogs: TStorageLogs
  storageAddress: string
  parsedOutput: null | TParsedParams[]
  parsedInput: null | TParsedParams[]
  parsedEvents: TParsedEventLog[]
  parsedError: null | TParsedParams[]
  isContract: boolean
  functionSignature: null | string
  errorSignature: null | string
  input: string
  output: string
}
export type TBlockCreateSpecificData = {
  storageLogs: TStorageLogs
  storageAddress: string
  input: string
  salt: string
}

export type TParsedActiveBlock = {
  defaultData: null | TBlockDefaultData
  createSpecificData: null | TBlockCreateSpecificData
  callSpecificData: null | TBlockCallSpecificData
}
