import type { TIndexedStructLog, TStepInstruction } from '@evm-debuger/types'

export const validateInstruction = (instruction: TStepInstruction, structlog: TIndexedStructLog) => {
  if (instruction.pc !== structlog.pc) {
    return false
  }

  return !(instruction.opcode !== structlog.op)
}

export const createSourceMapIdentifier = (instruction: TStepInstruction): string => {
  return `${instruction.offset}:${instruction.length}:${instruction.fileId}`
}
