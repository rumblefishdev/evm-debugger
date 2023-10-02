import { AlternativeOpcodes, Opcodes } from './opcodes'

export const getOpcode = (opcode: string): Opcodes => {
  return Opcodes[opcode] || AlternativeOpcodes[opcode] || opcode
}

export const isPushType = (opcode: Opcodes): boolean => {
  const decimalOpcode = parseInt(opcode, 16)

  const decimalPush0Opcode = parseInt(Opcodes.PUSH0, 16)
  const decimalPush32Opcode = parseInt(Opcodes.PUSH32, 16)

  return decimalOpcode >= decimalPush0Opcode && decimalOpcode <= decimalPush32Opcode
}
