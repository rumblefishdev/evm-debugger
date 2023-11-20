/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */
import { ChainId } from '@evm-debuger/types'

import { chainNames } from '../config'

type SupportedChain = {
  name: string
}

export const supportedChains = Object.fromEntries(
  [
    ChainId.mainnet,
    ChainId.goerli,
    ChainId.polygon,
    ChainId.mumbai,
    ChainId.sepolia,
    // ChainId.arbitrum, // TODO
    // ChainId.arbitrumGoerli, // TODO
  ].map((chainId): [ChainId, SupportedChain] => [
    chainId,
    {
      name: chainNames[chainId],
    },
  ]),
) as unknown as Record<ChainId, SupportedChain>
