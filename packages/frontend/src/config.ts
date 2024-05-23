/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */
import { ChainId } from '@evm-debuger/types'
import { JsonRpcProvider, Network } from 'ethers'

export const transactionTraceProviderUrl = process.env.REACT_APP_EVM_DEBUGGER_URL

export const infoApiGatewayUrl = process.env.REACT_APP_INFO_GATEWAY_URL

export const srcMapProviderUrl = process.env.REACT_APP_EVM_DEBUGGER_URL

export const sentryDsn = process.env.REACT_APP_EVM_SENTRY_DSN

export const environment = process.env.REACT_APP_CONTENTFUL_ENVIRONMENT

export const traceStorageBucket = process.env.REACT_APP_TRACE_STORAGE_BUCKET

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const { version } = require('../package.json')

export const jsonRpcProvider: Record<ChainId, JsonRpcProvider> = {
  [ChainId.mainnet]: new JsonRpcProvider(process.env.REACT_APP_MAINNET_JSONRPC, 'mainnet', {
    staticNetwork: new Network('mainnet', ChainId.mainnet),
  }),
  [ChainId.amoy]: new JsonRpcProvider(process.env.REACT_APP_POLYGON_JSONRPC, 'amoy', {
    staticNetwork: new Network('amoy', ChainId.amoy),
  }),
  [ChainId.polygon]: new JsonRpcProvider(process.env.REACT_APP_POLYGON_JSONRPC, 'matic', {
    staticNetwork: new Network('matic', ChainId.polygon),
  }),
  [ChainId.mumbai]: new JsonRpcProvider(process.env.REACT_APP_MUMBAI_JSONRPC, 'maticmum', {
    staticNetwork: new Network('maticmum', ChainId.mumbai),
  }),
  [ChainId.sepolia]: new JsonRpcProvider(process.env.REACT_APP_SEPOLIA_JSONRPC, 'sepolia', {
    staticNetwork: new Network('sepolia', ChainId.sepolia),
  }),
  [ChainId.arbitrum]: new JsonRpcProvider(process.env.REACT_APP_ARBITRUM_ONE_JSONRPC, 'arbitrum', {
    staticNetwork: new Network('arbitrum', ChainId.arbitrum),
  }),
  [ChainId.arbitrumGoerli]: new JsonRpcProvider(process.env.REACT_APP_ARBITRUM_GOERLI_JSONRPC, 'arbitrum-goerli', {
    staticNetwork: new Network('arbitrum-goerli', ChainId.arbitrumGoerli),
  }),
}

export const chainNames = {
  [ChainId.mainnet]: 'Ethereum',
  [ChainId.amoy]: 'Amoy',
  [ChainId.polygon]: 'Polygon',
  [ChainId.mumbai]: 'Mumbai',
  [ChainId.sepolia]: 'Sepolia',
  [ChainId.arbitrum]: 'Arbitrum One',
  [ChainId.arbitrumGoerli]: 'Arbitrum Goerli',
}

// TODO: Revert when support is added
export const showChainOnStartScreen = {
  [ChainId.mainnet]: true,
  [ChainId.amoy]: true,
  [ChainId.polygon]: true,
  [ChainId.mumbai]: false,
  [ChainId.sepolia]: true,
  [ChainId.arbitrum]: false,
  [ChainId.arbitrumGoerli]: false,
}

export const supportedChainsIdList = Object.values(ChainId).filter((item) => typeof item === 'number')

export const reportIssuePageUrl = 'https://github.com/rumblefishdev/evm-debugger-issues/issues/new/choose'
