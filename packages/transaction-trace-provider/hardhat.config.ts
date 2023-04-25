import type { HardhatUserConfig } from 'hardhat/config'
import { ChainId } from '@evm-debuger/types'

export const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    cache: '/tmp/cache',
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/PmDXrefs8kgu3ERHun0yjVkeGrVqs0MQ',
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
            london: 33_130_000,
          },
        },
        [ChainId.sepolia]: {
          hardforkHistory: {
            london: 3_100_000,
          },
        },
        [ChainId.arbitrum]: {
          hardforkHistory: {
            london: 70_000_000,
          },
        },
        [ChainId.arbitrumGoerli]: {
          hardforkHistory: {
            london: 11_500_000,
          },
        },
      },
    },
  },
}

export default config
