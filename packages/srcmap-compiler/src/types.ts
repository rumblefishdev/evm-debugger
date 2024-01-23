import type {
  ISrcMapApiPayload,
  TEtherscanParsedSourceCode,
} from '@evm-debuger/types'

export type TSourceFile = {
  path: string
  content: string
}

export type TSrcMapCompilerHandler = {
  payload: ISrcMapApiPayload
  initialLambdaRequestId: string
}

export type Contract = {
  evm: {
    evm: {
      bytecode: {
        object: string
        opcodes: string
        sourceMap: string
      }
      deployedBytecode: {
        object: string
        opcodes: string
        sourceMap: string
      }
    }
  }
}

export type Source = { id: number }

export type SolcOutput = {
  contracts: Record<string, Contract>
  sources: Record<string, Source>
}

export interface SolcManager {
  compile: (input: TEtherscanParsedSourceCode) => string
}
