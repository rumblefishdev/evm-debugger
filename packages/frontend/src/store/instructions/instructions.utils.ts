import { v4 as createUUID } from 'uuid'

import type { TInstructionState } from './instructions.types'

export const createMockedInstruction = (address?: string): TInstructionState => {
  return {
    instructions: [],
    address: address || createUUID(),
  }
}

export const createMockedInstructions = (count: number): TInstructionState[] => {
  return Array.from({ length: count }, (_, index) => createMockedInstruction(index.toString()))
}
