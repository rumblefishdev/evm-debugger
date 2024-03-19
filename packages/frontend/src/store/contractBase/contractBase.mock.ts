import type { TAnalyzerContractBaseData } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createMockedContractBase = (): TAnalyzerContractBaseData => ({
  address: createUUID(),
})

export const createMockedContractBaseWithName = (): TAnalyzerContractBaseData => ({
  ...createMockedContractBase(),
  name: 'contractName',
})
