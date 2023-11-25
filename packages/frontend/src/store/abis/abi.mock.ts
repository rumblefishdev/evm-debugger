import { v4 as createUUID } from 'uuid'

import type { TAbiElement } from './abis.types'

export const createMockedAbi = (address?: string): TAbiElement => {
  return {
    address: address || createUUID(),
    abi: [],
  }
}

export const createMockedAbis = (count: number): TAbiElement[] => {
  return Array.from({ length: count }, (_, index) => createMockedAbi(index.toString()))
}
