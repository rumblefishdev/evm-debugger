import { v4 as createUUID } from 'uuid'

import type { TSourceCodes } from '../../types'

export const createMockedSourceCode = (address?: string): TSourceCodes => {
  return {
    sourceCode: 'some source code',
    address: address || createUUID(),
  }
}

export const createMockedSourceCodes = (count: number): TSourceCodes[] => {
  return Array.from({ length: count }, (_, index) => createMockedSourceCode(index.toString()))
}
