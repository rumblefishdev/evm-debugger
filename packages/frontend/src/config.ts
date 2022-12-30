import { ethers } from 'ethers'

export const etherscanUrl = 'https://api.etherscan.io'
export const etherscanKey = process.env.REACT_APP_ETHERSCAN_KEY
export const jsonRpcProvider = {
  1: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_MAINNET_JSONRPC, 'mainnet'),
}
