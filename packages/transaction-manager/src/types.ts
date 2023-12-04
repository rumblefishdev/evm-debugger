import type { ChainIds } from '@evm-debuger/config'

export type TTempExecs = {
  chainId: ChainIds
  forkBlockNumber: number
  forkingUrl: string
}

export type Contract = {
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
    assembly: string
  }
}

export type Source = { id: number }

export type SolcOutput = {
  contracts: Record<string, Record<string, Contract>>
  sources: Record<string, Source>
}
