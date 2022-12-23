import { Disassembler } from './disassembler'

const disassembler = new Disassembler()
  export async function disassembleBytecode(hexcode) {
  return await disassembler.disassemble(hexcode)
}