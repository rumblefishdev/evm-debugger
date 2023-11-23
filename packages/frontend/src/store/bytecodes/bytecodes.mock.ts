/* eslint-disable import/exports-last */
import { v4 as createUUID } from 'uuid'

import type { TBytecodes } from './bytecodes.types'

export const createEmptyMockedBytecode = (address?: string): TBytecodes => ({
  disassembled: null,
  bytecode: null,
  address: address || createUUID(),
})

export const createMockedBytecodeWithDisassembled = (address?: string): TBytecodes => ({
  disassembled: [
    {
      pc: '0x0',
      operand: '1212',
      opcode: 0,
    },
  ],
  bytecode: createUUID(),
  address: address || createUUID(),
})

export const createMockedBytecode = (address?: string): TBytecodes => ({
  disassembled: null,
  bytecode: 'some bytecode string',
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

export const createMockedBytecodes = (count: number, type?: 'empty' | 'bytecode' | 'dissasembled'): TBytecodes[] => {
  const method = getMappingMethod(type)
  return Array.from({ length: count }, (_, index) => method(index.toString()))
}
