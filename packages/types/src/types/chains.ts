/* eslint-disable unicorn/numeric-separators-style */
export enum ChainId {
  mainnet = 1,
  goerli = 5,
  polygon = 137,
  mumbai = 80001,
  sepolia = 11155111,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
}

export const forkingUrlMap = {
  [ChainId.mainnet]: `https://eth-mainnet.alchemyapi.io/v2/`,
  [ChainId.goerli]: `https://eth-goerli.alchemyapi.io/v2/`,
  [ChainId.polygon]: `https://polygon-mainnet.g.alchemy.com/v2/`,
  [ChainId.mumbai]: `https://polygon-mumbai.g.alchemy.com/v2/`,
  [ChainId.sepolia]: `https://eth-sepolia.g.alchemy.com/v2/`,
  [ChainId.arbitrum]: `https://arb-mainnet.g.alchemy.com/v2`,
  [ChainId.arbitrumGoerli]: `https://arb-goerli.g.alchemy.com/v2`,
}
