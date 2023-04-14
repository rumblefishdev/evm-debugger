import type { HardhatUserConfig } from 'hardhat/config'
import { ChainId } from '@evm-debuger/types'

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    cache: '/tmp/cache',
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.HARDHAT_FORKING_URL,
      },
      chains: {
        // chains are configured to fork from blocks around the time of
        // March 15th 2023. it seems like a safe timespan for our use case.

        // CAUTION:
        // we shouldn't fork from too old blocks, because of getting errors of
        // too many requests per second
        [ChainId.polygon]: {
          hardforkHistory: {
            london: 0,
          },
        },
        [ChainId.mumbai]: {
          hardforkHistory: {
            london: 33130000,
          },
        },
        [ChainId.sepolia]: {
          hardforkHistory: {
            london: 3100000,
          },
        },
        [ChainId.arbitrum]: {
          hardforkHistory: {
            london: 70000000,
          },
        },
        [ChainId.arbitrumGoerli]: {
          hardforkHistory: {
            london: 11500000,
          },
        },
      },
    },
  },
}

export default config
