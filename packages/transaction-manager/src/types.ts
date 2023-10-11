import type { ChainIds } from '@evm-debuger/config'

export type TTempExecs = {
  chainId: ChainIds
  forkBlockNumber: number
  forkingUrl: string
}
