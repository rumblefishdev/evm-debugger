/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */

import { ChainId } from '@evm-debuger/types'

export const forkingUrlMap = {
  [ChainId.mainnet]: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
  [ChainId.goerli]: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
  [ChainId.polygon]: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
  [ChainId.mumbai]: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
  [ChainId.sepolia]: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
  [ChainId.arbitrum]: `https://arb-mainnet.g.alchemy.com/v2${process.env.ALCHEMY_KEY}`,
  [ChainId.arbitrumGoerli]: `https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
}
