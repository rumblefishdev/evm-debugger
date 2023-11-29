export enum ChainIds {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_GOERLI = 5,
  ETHEREUM_SEPOLIA = 11155111,
  POLYGON_MAINNET = 137,
  POLYGON_MUMBAI = 80001,
  ARBITRUM_MAINNET = 42161,
  ARBITRUM_GOERLI = 421613,
}

export const BLOCK_NUMBERS = {
  [ChainIds.ETHEREUM_MAINNET]: 18669354,
  [ChainIds.ETHEREUM_GOERLI]: 9807546,
  [ChainIds.ETHEREUM_SEPOLIA]: 4422698,
  [ChainIds.POLYGON_MAINNET]: 50488356,
  [ChainIds.POLYGON_MUMBAI]: 40826843,
  [ChainIds.ARBITRUM_MAINNET]: 137412272,
  [ChainIds.ARBITRUM_GOERLI]: 45402720,
}

export const ALCHEMY_API_URLS = {
  [ChainIds.ETHEREUM_MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/',
  [ChainIds.ETHEREUM_GOERLI]: 'https://eth-goerli.alchemyapi.io/v2/',
  [ChainIds.ETHEREUM_SEPOLIA]: 'https://eth-sepolia.g.alchemy.com/v2/',
  [ChainIds.POLYGON_MAINNET]: 'https://polygon-mainnet.g.alchemy.com/v2/',
  [ChainIds.POLYGON_MUMBAI]: 'https://polygon-mumbai.g.alchemy.com/v2/',
  [ChainIds.ARBITRUM_MAINNET]: 'https://arb-mainnet.g.alchemy.com/v2',
  [ChainIds.ARBITRUM_GOERLI]: 'https://arb-goerli.g.alchemy.com/v2',
}

export const BLOCKCHAIN_API_URLS = {
  [ChainIds.ETHEREUM_MAINNET]: 'https://api.etherscan.io',
  [ChainIds.ETHEREUM_GOERLI]: 'https://api-goerli.etherscan.io',
  [ChainIds.ETHEREUM_SEPOLIA]: 'https://sepolia.etherscan.io',
  [ChainIds.POLYGON_MAINNET]: 'https://api.polygonscan.com',
  [ChainIds.POLYGON_MUMBAI]: 'https://api-mumbai.polygonscan.com',
  [ChainIds.ARBITRUM_MAINNET]: 'https://api.arbiscan.io',
  [ChainIds.ARBITRUM_GOERLI]: 'https://api-goerli.arbiscan.io',
}
