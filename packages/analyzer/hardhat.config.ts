import type { HardhatUserConfig } from 'hardhat/config'

import dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  
  networks: {
    // ethereum: {
    //   url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`],
    //   forking: {
    //     url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
    //     blockNumber: 16_097_308,
    //   },
    // },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        blockNumber: 16_097_308,
      },
    },
    
  },
}

export default config
