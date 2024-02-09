import type { ErrorDescription, FunctionFragment, Result } from 'ethers'

import type { TEventInfo, TStorageLogs } from './types'
import type { BaseOpcodesHex, AlternativeOpcodesHex } from './opcodes/opcodesHex'

export type TTraceLogBase = {
  depth: number
  passedGas: number
  gasCost: number
  pc: number
  index: number
  op: keyof typeof BaseOpcodesHex | keyof typeof AlternativeOpcodesHex
}

export type TCallTypeData = {
  output: string

  decodedInput?: Result
  decodedOutput?: Result

  functionFragment?: FunctionFragment
  errorDescription?: ErrorDescription

  events: TEventInfo[]
}

export type TCreateTypeData = {
  salt?: string
}

export type TTraceLogData = {
  stackTrace: number[]

  startIndex: number
  returnIndex?: number

  isSuccess?: boolean
  isReverted?: boolean
  isContract?: boolean

  address: string
  storageAddress?: string
  blockNumber?: string
  storageLogs?: TStorageLogs

  value: string
  input: string
  passedGas: number
}

export type TTraceLog = TTraceLogBase &
  TTraceLogData & {
    callTypeData?: TCallTypeData
    createTypeData?: TCreateTypeData
  }

export type TTraceReturnLog = TTraceLogBase & {
  output?: string
}
