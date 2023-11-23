import '@nomicfoundation/hardhat-toolbox'
import { HardhatUserConfig } from 'hardhat/types'
import { ChainIds } from '@evm-debuger/config'
export const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    cache: '/tmp/cache',
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      },
      chains: {
        // chains are configured to fork from blocks around the time of
        // March 15th 2023. it seems like a safe timespan for our use case.

        // CAUTION:
        // we shouldn't fork from too old blocks, because of getting errors of
        // too many requests per second
        [ChainIds.POLYGON_MAINNET]: {
          hardforkHistory: {
            london: 0,
          },
        },
        [ChainIds.POLYGON_MUMBAI]: {
          hardforkHistory: {
            london: 33_130_000,
          },
        },
        [ChainIds.ETHEREUM_SEPOLIA]: {
          hardforkHistory: {
            london: 3_100_000,
          },
        },
        [ChainIds.ARBITRUM_MAINNET]: {
          hardforkHistory: {
            london: 70_000_000,
          },
        },
        [ChainIds.ARBITRUM_GOERLI]: {
          hardforkHistory: {
            london: 11_500_000,
          },
        },
      },
    },
  },
}

export default config
