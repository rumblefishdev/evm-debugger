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
    yulContents: null,
    sourceMap: 'some source map',
    linkReferences: null,
    immutableReferences: null,
    functionDebugData: null,
    fileName: 'some file name',
    contractName: 'some contract name',
    bytecode: 'some object',
    ast: null,
    address: address || createUUID(),
  }
}
