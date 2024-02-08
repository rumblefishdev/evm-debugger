import type { BaseOpcodesHex, AlternativeOpcodesHex } from './opcodes/opcodesHex'

export type TRawStructLogStorage = Record<string, string>

export type TRawStructLog = {
  pc: number
  op: keyof typeof BaseOpcodesHex | keyof typeof AlternativeOpcodesHex
  gas: number
  gasCost: number
  depth: number
  stack: string[]
  memory: string[]
  storage: TRawStructLogStorage
}

export type TIndexedStructLog = TRawStructLog & { index: number }
