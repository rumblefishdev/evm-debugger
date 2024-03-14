import { BaseOpcodesHex, getOpcodeAsName, type TDisassembledBytecode } from '@evm-debuger/types'

const getPushLength = (opcodeByte: number): number => {
  const decimalPush1Opcode = BaseOpcodesHex.PUSH1
  const decimalPush0Opcode = BaseOpcodesHex.PUSH0
  const decimalPush32Opcode = BaseOpcodesHex.PUSH32

  if (opcodeByte >= decimalPush1Opcode && opcodeByte <= decimalPush32Opcode) {
    return opcodeByte - decimalPush0Opcode
  }

  return 0
}

export const bytecodeDisassembler = (bytecode: string, withPushValue?: boolean): TDisassembledBytecode => {
  const bytecodeAsBuffer = Buffer.from(bytecode.replace('0x', ''), 'hex')
  const dissasembledBytecode: TDisassembledBytecode = {}

  let programCounter = 0

  for (let index = 0; programCounter < bytecodeAsBuffer.length; index++) {
    const opcodeByte = bytecodeAsBuffer[programCounter]

    const opcode = getOpcodeAsName(opcodeByte)
    const pushLength = getPushLength(opcodeByte)

    if (pushLength) {
      const pushValue = bytecodeAsBuffer.subarray(programCounter + 1, programCounter + 1 + pushLength).toString('hex')
      dissasembledBytecode[index] = {
        value: withPushValue && pushValue,
        pc: programCounter,
        opcode,
        index,
      }
      programCounter += pushLength
    } else {
      dissasembledBytecode[index] = {
        pc: programCounter,
        opcode,
        index,
      }
    }
    programCounter++
  }

  return dissasembledBytecode
}

export class EVMMachine {
  public dissasembleBytecode(bytecode: string): TDisassembledBytecode {
    return bytecodeDisassembler(bytecode, true)
  }
}
