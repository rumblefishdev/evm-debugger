import {HardhatUserConfig} from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`
      },
    },
  },
  paths: {
     cache: "/tmp/cache"
  }
}

export default config
