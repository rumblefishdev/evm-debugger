import type { TYulBlock } from './yulSources'

export type TFunctionDebugData = {
  entryPoint: number
  id: number
  parameterSlots: number
  returnSlots: number
}

export type TContractBytecodeObject = {
  functionDebugData: Record<string, TFunctionDebugData>
  generatedSources: { ast: TYulBlock; contents: string }[]
  immutableReferences: Record<string, { length: number; start: number }[]>
  linkReferences: string
  object: string
  opcodes: string
  sourceMap: string
}

export type Contract = Record<
  string,
  {
    evm: {
      assembly: string
      bytecode: TContractBytecodeObject
      deployedBytecode: TContractBytecodeObject
    }
  }
>

export type Source = { id: number }

export type SolcOutput = {
  contracts: Record<string, Contract>
  sources: Record<string, Source>
}
