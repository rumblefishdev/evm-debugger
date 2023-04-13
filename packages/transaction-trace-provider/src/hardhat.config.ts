import type { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    cache: '/tmp/cache',
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.HARDHAT_FORKING_URL,
        ignoreUnknownTxType: true,
      },
      chains: {
        137: {
          hardforkHistory: {
            london: 23850000,
          },
        },
        80001: {
          hardforkHistory: {
            london: 23850000,
          },
        },
        42161: {
          hardforkHistory: {
            london: 23850000,
          },
        },
      },
    },
  },
}

export default config
