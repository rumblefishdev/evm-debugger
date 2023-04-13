/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */
import { ethers } from 'ethers'

export const etherscanUrls = {
  /** mainnet */
  1: {
    url: 'https://api.etherscan.io',
    key: process.env.REACT_APP_ETHERSCAN_KEY,
  },

  /** goerli */
  5: {
    url: 'https://api-goerli.etherscan.io',
    key: process.env.REACT_APP_ETHERSCAN_KEY,
  },

  /** polygon */
  137: {
    url: 'https://api.polygonscan.com',
    key: process.env.REACT_APP_POLYGONSCAN_KEY,
  },

  /** mumbai */
  80001: {
    url: 'https://api-mumbai.polygonscan.com',
    key: process.env.REACT_APP_POLYGONSCAN_KEY,
  },

  /** sepolia */
  11155111: {
    url: 'https://sepolia.etherscan.io',
    key: process.env.REACT_APP_SEPOLIA_KEY,
  },

  /** arbitrum one */
  42161: {
    url: 'https://api.arbiscan.io',
    key: process.env.REACT_APP_ARBITRUMSCAN_KEY,
  },

  /** arbitrum goerli */
  421613: {
    url: 'https://api-goerli.arbiscan.io',
    key: process.env.REACT_APP_ARBITRUMSCAN_KEY,
  },
}

export const transactionTraceProviderUrl = 'https://evm-debugger.rumblefish.dev'
export const jsonRpcProvider = {
  /** mainnet */
  1: new ethers.providers.StaticJsonRpcProvider(
    process.env.REACT_APP_MAINNET_JSONRPC,
    'mainnet',
  ),

  /** goerli */
  5: new ethers.providers.StaticJsonRpcProvider(
    process.env.REACT_APP_GOERLI_JSONRPC,
    'goerli',
  ),

  /** polygon */
  137: new ethers.providers.StaticJsonRpcProvider(
    process.env.REACT_APP_POLYGON_JSONRPC,
    'polygon',
  ),

  /** mumbai */
  80001: new ethers.providers.StaticJsonRpcProvider(
    process.env.REACT_APP_MUMBAI_JSONRPC,
    'mumbai',
  ),

  /** sepolia */
  11155111: new ethers.providers.StaticJsonRpcProvider(
    process.env.REACT_APP_SEPOLIA_JSONRPC,
    'sepolia',
  ),

  /** arbitrum one */
  42161: new ethers.providers.StaticJsonRpcProvider(
    process.env.REACT_APP_ARBITRUM_ONE_JSONRPC,
    'arbitrum-one',
  ),

  /** arbitrum goerli */
  421613: new ethers.providers.StaticJsonRpcProvider(
    process.env.REACT_APP_ARBITRUM_GOERLI_JSONRPC,
    'arbitrum-goerli',
  ),
}
