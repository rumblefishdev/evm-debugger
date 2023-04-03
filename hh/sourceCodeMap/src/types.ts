import { SourceMapElementTree } from "./sourceMapElementTree";

export type SolcOutput = {
  [k: string]: {
    [n: string]: {
      evm: {
        evm: {
          deployedBytecode: {
            opcodes: string,
            sourceMap: string
          }
        }
      }
    }
  }
}

export type EntryType = {
  fileName: string,
  contractName: string,
  opcodes: string,
  opcodesRaw: string,
  sourceMap: SourceMapElementTree,
}