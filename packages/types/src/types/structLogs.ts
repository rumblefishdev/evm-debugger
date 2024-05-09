import type { TOpcodesNames } from './opcodes/opcodesHex'

export type TRawStructLogStorage = Record<string, string>

export type TRawStructLog = {
  pc: number
  op: TOpcodesNames
  gas: number
  gasCost: number
  depth: number
  stack: string[]
  memory: string[]
  storage: TRawStructLogStorage
}

export type TIndexedStructLog = TRawStructLog & { index: number; traceLogIndex?: number; operand?: string; dynamicGasCost: number }
