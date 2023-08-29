import type { SourceMapElementTree } from './sourceMapElementTree'

export type SolcOutput = Record<
  string,
  Record<
    string,
    {
      evm: {
        evm: {
          deployedBytecode: {
            opcodes: string
            sourceMap: string
          }
        }
      }
    }
  >
>

export type TSourceFile = {
  path: string
  content: string
}

export type TSourceMapEntry = {
  fileName: string
  contractName: string
  opcodes?: string
  opcodesRaw?: string
  sourceMap?: SourceMapElementTree
  rawSourceMap: string
}
