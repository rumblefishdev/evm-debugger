import type { TAnalyzerContractBaseOutput } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createEmptyMockedContract = (address?: string): TAnalyzerContractBaseOutput => ({
  address: address || createUUID(),
})

export const createMockedContract = (address?: string): TAnalyzerContractBaseOutput => ({
  contractName: 'some contract name',
  address: address || createUUID(),
})

export const createMockedContracts = (count: number, type: 'empty' | 'contractName' = 'empty'): TAnalyzerContractBaseOutput[] => {
  const method = type === 'contractName' ? createMockedContract : createEmptyMockedContract
  return Array.from({ length: count }, (_, index) => method(index.toString()))
}
