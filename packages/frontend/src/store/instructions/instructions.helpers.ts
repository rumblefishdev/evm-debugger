import { AlternativeOpcodes, Opcodes } from '@evm-debuger/analyzer'
import type { TIndexedStructLog, TStepInstruction } from '@evm-debuger/types'

export const validateInstruction = (instruction: TStepInstruction, structlog: TIndexedStructLog) => {
  const structlogOpcodeHex = Opcodes[structlog.op] || AlternativeOpcodes[structlog.op]

  if (instruction.pc !== structlog.pc) {
    return false
  }

  return !(instruction.opcode !== structlogOpcodeHex)
}

export const createSourceMapIdentifier = (instruction: TStepInstruction): string => {
  return `${instruction.offset}:${instruction.length}`
}
