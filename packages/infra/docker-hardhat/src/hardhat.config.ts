import {HardhatUserConfig} from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/878e926a46484694ac7c93c1fdbcb167`,
      },
    },
  },
  paths: {
     cache: "/tmp/cache"
  }
}

export default config
