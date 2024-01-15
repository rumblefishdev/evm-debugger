import '@nomicfoundation/hardhat-toolbox'
import { HardhatUserConfig } from '@rumblefishdev/hardhat/types'
import 'dotenv/config'

if (!process.env.ALCHEMY_KEY) throw Error("No ALCHEMY_KEY in .env")

export enum ChainId {
  mainnet = 1,
  goerli = 5,
  polygon = 137,
  mumbai = 80001,
  sepolia = 11155111,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
}

export const forkingUrlMap = {
  [ChainId.mainnet]: `https://eth-mainnet.alchemyapi.io/v2/`,
  [ChainId.goerli]: `https://eth-goerli.alchemyapi.io/v2/`,
  [ChainId.polygon]: `https://polygon-mainnet.g.alchemy.com/v2/`,
  [ChainId.mumbai]: `https://polygon-mumbai.g.alchemy.com/v2/`,
  [ChainId.sepolia]: `https://eth-sepolia.g.alchemy.com/v2/`,
  [ChainId.arbitrum]: `https://arb-mainnet.g.alchemy.com/v2`,
  [ChainId.arbitrumGoerli]: `https://arb-goerli.g.alchemy.com/v2`,
}

export const config: HardhatUserConfig = {
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
