/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */
import { ChainId } from '@evm-debuger/types'
import { ethers } from 'ethers'

export const transactionTraceProviderUrl = process.env.REACT_APP_EVM_DEBUGGER_URL

export const srcMapProviderUrl = process.env.REACT_APP_EVM_DEBUGGER_URL

export const sentryDsn = process.env.REACT_APP_EVM_SENTRY_DSN

export const environment = process.env.REACT_APP_CONTENTFUL_ENVIRONMENT

export const traceStorageBucket = process.env.REACT_APP_TRACE_STORAGE_BUCKET

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const { version } = require('../package.json')

export const jsonRpcProvider: Record<ChainId, ethers.providers.StaticJsonRpcProvider> = {
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

export const showChainOnStartScreen = {
  [ChainId.mainnet]: true,
  [ChainId.goerli]: true,
  [ChainId.polygon]: true,
  [ChainId.mumbai]: true,
  [ChainId.sepolia]: true,
  [ChainId.arbitrum]: false,
  [ChainId.arbitrumGoerli]: false,
}

export const supportedChainsIdList = Object.values(ChainId).filter((item) => typeof item === 'number')

export const reportIssuePageUrl = 'https://github.com/rumblefishdev/evm-debugger-issues/issues/new/choose'
