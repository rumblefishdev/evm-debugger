/* eslint-disable import/exports-last */
import type { TContractDissasembledBytecode } from '@evm-debuger/types'
import { BaseOpcodesHex } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createMockedBytecode = (address?: string): TContractDissasembledBytecode => ({
  disassembledBytecode: {
    0x00: { value: BaseOpcodesHex[0x00], pc: 0x00, opcode: 'PUSH1', index: 0 },
  },
  address: address || createUUID(),
})
