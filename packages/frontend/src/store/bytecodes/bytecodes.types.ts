export type TOpcodeDisassemled = {
  opcode: number
  operand: string
  pc: string
}

export type TDisassembledBytecode = { pc: string; opcode: number; operand: string | null; index: number }
export type TDisassembledBytecodeList = Record<string, TDisassembledBytecode>

export type TBytecodes = {
  address: string
  bytecode: string | null
  disassembled: TOpcodeDisassemled[] | null
}

export type TInitializeBytecodesPayload = string[]
