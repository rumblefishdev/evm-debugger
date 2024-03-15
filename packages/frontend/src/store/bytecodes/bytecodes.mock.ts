/* eslint-disable import/exports-last */
import type { TContractDissasembledBytecode } from '@evm-debuger/types'
import { BaseOpcodesHex } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createEmptyMockedBytecode = (address?: string): TContractDissasembledBytecode => ({
  disassembledBytecode: {},
  address: address || createUUID(),
})

export const createMockedBytecodeWithDisassembled = (address?: string): TContractDissasembledBytecode => ({
  disassembledBytecode: {
    0x00: { value: BaseOpcodesHex[0x00], pc: 0x00, opcode: 'PUSH1', index: 0 },
  },
  address: address || createUUID(),
})

export const createMockedBytecode = (address?: string): TContractDissasembledBytecode => ({
  disassembledBytecode: {},
  address: address || createUUID(),
})

const getMappingMethod = (type: 'empty' | 'bytecode' | 'dissasembled') => {
  switch (type) {
    case 'bytecode':
      return createMockedBytecode
    case 'dissasembled':
      return createMockedBytecodeWithDisassembled
    default:
      return createEmptyMockedBytecode
  }
}

export const createMockedBytecodes = (count: number, type?: 'empty' | 'bytecode' | 'dissasembled'): TContractDissasembledBytecode[] => {
  const method = getMappingMethod(type)
  return Array.from({ length: count }, (_, index) => method(index.toString()))
}
