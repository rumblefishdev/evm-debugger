import { v4 as createUUID } from 'uuid'

import type { TContractNames } from './contractNames.types'

export const createEmptyMockedContractName = (address?: string): TContractNames => ({
  contractName: null,
  address: address || createUUID(),
})

export const createMockedContractName = (address?: string): TContractNames => ({
  contractName: 'some contract name',
  address: address || createUUID(),
})

export const createMockedContractNames = (count: number, type: 'empty' | 'contractName' = 'empty'): TContractNames[] => {
  const method = type === 'contractName' ? createMockedContractName : createEmptyMockedContractName
  return Array.from({ length: count }, (_, index) => method(index.toString()))
}
