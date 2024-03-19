import type { TAnalyzerContractRawData, TSourceMap } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createMockedContractRawData = (address: string): TAnalyzerContractRawData => ({
  sourceMap: 'sourceMap',
  etherscanBytecode: 'etherscanBytecode',
  bytecode: 'bytecode',
  applicationBinaryInterface: [{ type: 'function', outputs: [], name: 'functionName', inputs: [] }],
  address,
})

export const createMockedSourceMap = (address?: string): TSourceMap & { address: string } => {
  return {
    fileName: 'some file name',
    deployedBytecode: {
      sourceMap: 'some source map',
      opcodes: 'some opcodes',
      object: 'some object',
      contents: null,
      ast: null,
    },
    contractName: 'some contract name',
    address: address || createUUID(),
  }
}
