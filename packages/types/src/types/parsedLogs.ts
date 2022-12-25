import type { ethers } from 'ethers'

import type {
  TCallTypeOpcodes,
  TCreateTypeOpcodes,
  TOpCodes,
  TReturnTypeOpcodes,
} from './opcodes'
import type { IErrorDescription, TEventInfo, TStorageLogs } from './types'

export interface ITraceLog {
  type: TOpCodes
  depth: number
  passedGas: number
  gasCost: number
  pc: number
  index: number
  blockNumber?: string
}
export interface ICallTypeTraceLog extends ITraceLog {
  type: TCallTypeOpcodes
  input: string
  output: string
  address: string

  startIndex: number
  stackTrace: number[]
  value: string

  decodedInput?: ethers.utils.Result
  decodedOutput?: ethers.utils.Result
  functionDescription?: ethers.utils.TransactionDescription
  errorDescription?: IErrorDescription
  events: TEventInfo[]
  returnIndex?: number
  isSuccess?: boolean
  isReverted?: boolean
  isContract?: boolean

  storageAddress?: string
  storageLogs?: TStorageLogs
}

export interface IReturnTypeTraceLog extends ITraceLog {
  type: TReturnTypeOpcodes
  output: string
}

export interface ICreateTypeTraceLog extends ITraceLog {
  type: TCreateTypeOpcodes
  startIndex: number
  stackTrace: number[]
  value: string
  input: string
  salt?: string
  isSuccess?: boolean
  isReverted?: boolean
  returnIndex?: number

  address: string
  storageAddress?: string
  storageLogs?: TStorageLogs
}

export interface IStopTypeTraceLog extends ITraceLog {
  type: 'STOP'
}

export type TReturnedTraceLog =
  | ICallTypeTraceLog
  | IReturnTypeTraceLog
  | ICreateTypeTraceLog
  | IStopTypeTraceLog

export type TMainTraceLogs = ICallTypeTraceLog | ICreateTypeTraceLog
