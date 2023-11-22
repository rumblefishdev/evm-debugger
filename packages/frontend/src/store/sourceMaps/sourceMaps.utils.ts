import { v4 as createUUID } from 'uuid'

import type { TSourceMapSlice } from './sourceMaps.types'

export const createMockedSourceMap = (address?: string): TSourceMapSlice => {
  return {
    fileName: 'some file name',
    deployedBytecode: {
      sourceMap: 'some source map',
      opcodes: 'some opcodes',
      object: 'some object',
    },
    contractName: 'some contract name',
    bytecode: {
      sourceMap: 'some source map',
      opcodes: 'some opcodes',
      object: 'some object',
    },
    address: address || createUUID(),
  }
}

export const createMockedSourceMaps = (count: number): TSourceMapSlice[] => {
  return Array.from({ length: count }, (_, index) => createMockedSourceMap(index.toString()))
}
