import type { ErrorDescription, FunctionFragment, Result } from 'ethers'

import type { FunctionBlockEndOpcodes, FunctionBlockStartOpcodes } from './opcodes/opcodesGroups'
import type { TEventInfo, TStorageLogs } from './types'

export type TTraceLogBase = {
  depth: number
  passedGas: number
  gasCost: number
  pc: number
  index: number
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

export type TTraceLog = TTraceLogBase & {
  op: keyof typeof FunctionBlockStartOpcodes
  depth: number
  passedGas: number
  gasCost: number
  pc: number
  stackTrace: number[]

  startIndex: number
  returnIndex?: number

  isSuccess?: boolean
  isReverted?: boolean
  isContract?: boolean

  address: string
  storageAddress?: string
  storageLogs?: TStorageLogs

  value: string
  input: string

  callTypeData?: TCallTypeData
  createTypeData?: TCreateTypeData
}

export type TTraceReturnLog = TTraceLogBase & {
  op: FunctionBlockEndOpcodes
  output?: string
}
