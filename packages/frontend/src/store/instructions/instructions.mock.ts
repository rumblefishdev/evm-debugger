import type { TContractInstructions } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createMockedInstruction = (address?: string): TContractInstructions => {
  return {
    instructions: [],
    address: address || createUUID(),
  }
}
