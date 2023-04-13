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
      },
      chains: {
        137: {
          hardforkHistory: {
            london: 40400000,
          },
        },
        80001: {
          hardforkHistory: {
            london: 33130000,
          },
        },
        11155111: {
          hardforkHistory: {
            london: 3100000,
          },
        },
        42161: {
          hardforkHistory: {
            london: 70000000,
          },
        },
        421613: {
          hardforkHistory: {
            london: 11500000,
          },
        },
      },
    },
  },
}

export default config
