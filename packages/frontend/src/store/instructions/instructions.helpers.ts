import { AlternativeOpcodes, Opcodes } from '@evm-debuger/analyzer'
import type { IStructLog, TStepInstruction } from '@evm-debuger/types'

export const validateInstruction = (instruction: TStepInstruction, structlog: IStructLog) => {
  const structlogOpcodeHex = Opcodes[structlog.op] || AlternativeOpcodes[structlog.op]

  if (instruction.pc !== structlog.pc) {
    return false
  }

  return !(instruction.opcode !== structlogOpcodeHex)
}
