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
    },
  },
}

export default config
