/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */
import { ChainId } from '@evm-debuger/types'
import { ethers } from 'ethers'

export const etherscanUrls = {
  [ChainId.mainnet]: {
    url: 'https://api.etherscan.io',
    key: process.env.REACT_APP_ETHERSCAN_KEY,
  },
  [ChainId.goerli]: {
    url: 'https://api-goerli.etherscan.io',
    key: process.env.REACT_APP_ETHERSCAN_KEY,
  },
  [ChainId.sepolia]: {
    url: 'https://sepolia.etherscan.io',
    key: process.env.REACT_APP_ETHERSCAN_KEY,
  },

  [ChainId.polygon]: {
    url: 'https://api.polygonscan.com',
    key: process.env.REACT_APP_POLYGONSCAN_KEY,
  },
  [ChainId.mumbai]: {
    url: 'https://api-mumbai.polygonscan.com',
    key: process.env.REACT_APP_POLYGONSCAN_KEY,
  },

  [ChainId.arbitrum]: {
    url: 'https://api.arbiscan.io',
    key: process.env.REACT_APP_ARBITRUMSCAN_KEY,
  },
  [ChainId.arbitrumGoerli]: {
    url: 'https://api-goerli.arbiscan.io',
    key: process.env.REACT_APP_ARBITRUMSCAN_KEY,
  },
}

export const transactionTraceProviderUrl = process.env.REACT_APP_EVM_DEBUGGER_URL

export const sentryDsn = process.env.REACT_APP_EVM_SENTRY_DSN

export const environment = process.env.REACT_APP_CONTENTFUL_ENVIRONMENT

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const { version } = require('../package.json')

export const jsonRpcProvider = {
  [ChainId.mainnet]: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_MAINNET_JSONRPC, 'mainnet'),

  [ChainId.goerli]: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_GOERLI_JSONRPC, 'goerli'),

  [ChainId.polygon]: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_POLYGON_JSONRPC, 'matic'),

  [ChainId.mumbai]: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_MUMBAI_JSONRPC, 'maticmum'),

  [ChainId.sepolia]: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_SEPOLIA_JSONRPC, 'sepolia'),

  [ChainId.arbitrum]: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_ARBITRUM_ONE_JSONRPC, 'arbitrum'),

  [ChainId.arbitrumGoerli]: new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_ARBITRUM_GOERLI_JSONRPC, 'arbitrum-goerli'),
}

export const chainNames = {
  [ChainId.mainnet]: 'Ethereum',
  [ChainId.goerli]: 'Goerli',
  [ChainId.polygon]: 'Polygon',
  [ChainId.mumbai]: 'Mumbai',
  [ChainId.sepolia]: 'Sepolia',
  [ChainId.arbitrum]: 'Arbitrum One',
  [ChainId.arbitrumGoerli]: 'Arbitrum Goerli',
}
