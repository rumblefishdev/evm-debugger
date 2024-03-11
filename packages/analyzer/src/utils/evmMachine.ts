import { BaseOpcodesHex, getOpcodeAsName, type TDissasembledBytecode } from '@evm-debuger/types'

const getPushLength = (opcodeByte: number): number => {
  const decimalPush1Opcode = BaseOpcodesHex.PUSH1
  const decimalPush0Opcode = BaseOpcodesHex.PUSH0
  const decimalPush32Opcode = BaseOpcodesHex.PUSH32

  if (opcodeByte >= decimalPush1Opcode && opcodeByte <= decimalPush32Opcode) {
    return opcodeByte - decimalPush0Opcode
  }

  return 0
}

export const bytecodeDisassembler = (bytecode: string, withPushValue?: boolean): TDissasembledBytecode => {
  const bytecodeAsBuffer = Buffer.from(bytecode.replace('0x', ''), 'hex')
  const dissasembledBytecode: TDissasembledBytecode = []

  for (let index = 0; index < bytecodeAsBuffer.length; index++) {
    const opcodeByte = bytecodeAsBuffer[index]

    const opcode = getOpcodeAsName(opcodeByte)
    const pushLength = getPushLength(opcodeByte)

    if (pushLength) {
      const pushValue = bytecodeAsBuffer.subarray(index + 1, index + 1 + pushLength).toString('hex')
      dissasembledBytecode.push({
        value: withPushValue && pushValue,
        pc: index,
        opcode,
      })
      index += pushLength
    } else {
      dissasembledBytecode.push({
        pc: index,
        opcode,
      })
    }
  }

  return dissasembledBytecode
}

export class EVMMachine {
  public dissasembleBytecode(bytecode: string): TDissasembledBytecode {
    return bytecodeDisassembler(bytecode, true)
  }
}
