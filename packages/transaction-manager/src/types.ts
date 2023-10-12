import type { ChainIds } from '@evm-debuger/config'

export type TTempExecs = {
  chainId: ChainIds
  forkBlockNumber: number
  forkingUrl: string
}

export type SolcOutput = Record<
  string,
  Record<
    string,
    {
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
  >
>
