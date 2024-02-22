import { v4 as createUUID } from 'uuid'

import type { TSourceMapSlice } from './sourceMaps.types'

export const createMockedSourceMap = (address?: string): TSourceMapSlice => {
  return {
    fileName: 'some file name',
    deployedBytecode: {
      sourceMap: 'some source map',
      opcodes: 'some opcodes',
      object: 'some object',
      ast: null,
    },
    contractName: 'some contract name',
    address: address || createUUID(),
  }
}

export const createMockedSourceMaps = (count: number): TSourceMapSlice[] => {
  return Array.from({ length: count }, (_, index) => createMockedSourceMap(index.toString()))
}
