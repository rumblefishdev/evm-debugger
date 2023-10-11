import { ALCHEMY_API_URLS, BLOCKCHAIN_API_URLS, ChainIds } from './chains'
import { API_KEYS } from './config'

export const getAlchemyApiUrl = (chainId: ChainIds): string => {
  return `${ALCHEMY_API_URLS[chainId]}${API_KEYS.alchemy}`
}

export const getBlockchainApiUrl = (chainId: ChainIds): { blockchainApiUrl: string; blockchainApiKey: string } => {
  switch (chainId) {
    case ChainIds.ETHEREUM_MAINNET:
    case ChainIds.ETHEREUM_GOERLI:
    case ChainIds.ETHEREUM_SEPOLIA:
      return { blockchainApiUrl: `${BLOCKCHAIN_API_URLS[chainId]}/api/`, blockchainApiKey: API_KEYS.ethereum }
    case ChainIds.POLYGON_MAINNET:
    case ChainIds.POLYGON_MUMBAI:
      return { blockchainApiUrl: `${BLOCKCHAIN_API_URLS[chainId]}/api/`, blockchainApiKey: API_KEYS.polygon }
    case ChainIds.ARBITRUM_MAINNET:
    case ChainIds.ARBITRUM_GOERLI:
      return { blockchainApiUrl: `${BLOCKCHAIN_API_URLS[chainId]}/api/`, blockchainApiKey: API_KEYS.arbitrum }
    default:
      return { blockchainApiUrl: '', blockchainApiKey: '' }
  }
}
