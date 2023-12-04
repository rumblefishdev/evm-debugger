import { v4 as createUUID } from 'uuid'

import type { TSourceCodes } from './sourceCodes.types'

export const createMockedSourceCode = (address?: string): TSourceCodes => {
  return {
    sourcesOrder: { 1: 'some source code' },
    sourceCode: 'some source code',
    address: address || createUUID(),
  }
}

export const createMockedSourceCodes = (count: number): TSourceCodes[] => {
  return Array.from({ length: count }, (_, index) => createMockedSourceCode(index.toString()))
}
