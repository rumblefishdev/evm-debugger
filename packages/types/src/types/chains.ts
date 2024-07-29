/* eslint-disable unicorn/numeric-separators-style */
export enum ChainId {
  mainnet = 1,
  polygon = 137,
  amoy = 80002,
  sepolia = 11155111,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
  base = 8453,
  baseSepolia = 84532,
}

export const forkingUrlMap = {
  [ChainId.mainnet]: `https://eth-mainnet.alchemyapi.io/v2/`,
  [ChainId.polygon]: `https://polygon-mainnet.g.alchemy.com/v2/`,
  [ChainId.amoy]: 'https://polygon-amoy.g.alchemy.com/v2/',
  [ChainId.sepolia]: `https://eth-sepolia.g.alchemy.com/v2/`,
  [ChainId.arbitrum]: `https://arb-mainnet.g.alchemy.com/v2`,
  [ChainId.arbitrumGoerli]: `https://arb-goerli.g.alchemy.com/v2`,
  [ChainId.base]: `https://base-mainnet.g.alchemy.com/v2/`,
  [ChainId.baseSepolia]: `https://base-sepolia.g.alchemy.com/v2/`,
}

export const etherscanUrls = {
  [ChainId.mainnet]: {
    url: 'https://api.etherscan.io',
    key: process.env.REACT_APP_ETHERSCAN_KEY,
  },
  [ChainId.amoy]: {
    url: 'https://api-amoy.polygonscan.com',
    key: process.env.REACT_APP_POLYGONSCAN_KEY,
  },
  [ChainId.sepolia]: {
    url: 'https://api-sepolia.etherscan.io',
    key: process.env.REACT_APP_ETHERSCAN_KEY,
  },
  [ChainId.polygon]: {
    url: 'https://api.polygonscan.com',
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
  [ChainId.base]: {
    url: 'https://api.basescan.org',
    key: process.env.REACT_APP_BASESCAN_KEY,
  },
  [ChainId.baseSepolia]: {
    url: 'https://api-sepolia.basescan.org',
    key: process.env.REACT_APP_BASESCAN_KEY,
  },
}
