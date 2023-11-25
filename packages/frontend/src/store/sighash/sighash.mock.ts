import type { TSighashStatus } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createMockedSighash = (sighash?: string): TSighashStatus => ({
  sighash: sighash || createUUID(),
  fragment: null,
  found: false,
  addresses: new Set(),
})

export const createMockedSighashes = (count: number): TSighashStatus[] => {
  return Array.from({ length: count }).map((_, index) => createMockedSighash(index.toString()))
}
