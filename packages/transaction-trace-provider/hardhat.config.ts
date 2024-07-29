import type { HardhatUserConfig } from 'hardhat/config'
import { ChainId, forkingUrlMap } from '@evm-debuger/types'

export const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    cache: '/tmp/cache',
  },
  networks: {
    hardhat: {
      chainId: parseInt(process.env.CHAIN_ID as string),
      forking: {
        url: `${forkingUrlMap[parseInt(process.env.CHAIN_ID as string)]}${process.env.ALCHEMY_KEY}`,
      },
      chains: {
        // chains are configured to fork from blocks around the time of
        // March 15th 2023. it seems like a safe timespan for our use case.

        // CAUTION:
        // we shouldn't fork from too old blocks, because of getting errors of
        // too many requests per second
        [ChainId.polygon]: {
          hardforkHistory: {
            cancun: 1,
            london: 1
          },
        },
        [ChainId.sepolia]: {
          hardforkHistory: {
            cancun: 3_100_000,
          },
        },
        [ChainId.amoy]: {
          hardforkHistory: {
            cancun: 1,
            london: 1
          },
        },
        [ChainId.arbitrum]: {
          hardforkHistory: {
            cancun: 70_000_000,
          },
        },
        [ChainId.arbitrumGoerli]: {
          hardforkHistory: {
            cancun: 11_500_000,
          },
        },
        [ChainId.base]: {
          hardforkHistory: {
            cancun: 1,
            london: 1
          },
        },
        [ChainId.baseSepolia]: {
          hardforkHistory: {
            cancun: 1,
            london: 1
          },
        },
      },
    },
  },
}

export default config
