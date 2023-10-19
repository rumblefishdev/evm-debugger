export type TDisassembledBytecode = { pc: string; opcode: number; operand: string | null; index: number }
export type TDisassembledBytecodeList = Record<string, TDisassembledBytecode>
