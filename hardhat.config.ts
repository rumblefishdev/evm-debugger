import { HardhatUserConfig } from 'hardhat/config'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomicfoundation/hardhat-toolbox'

import dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
    solidity: '0.8.9',
    networks: {
        hardhat: {
            forking: {
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
                blockNumber: 15881396,
            },
        },
    },
}

export default config
