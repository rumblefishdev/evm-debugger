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
        // chains are configured to fork from blocks around the time of
        // March 15th 2023. it seems like a safe timespan for our use case.

        // CAUTION:
        // we shouldn't fork from too old blocks, because of getting errors of
        // too many requests per second
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
