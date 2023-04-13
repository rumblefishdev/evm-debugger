/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */

export const forkingUrlMap = {
  1: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
  5: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
  137: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
  80001: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
  11155111: 'https://rpc.sepolia.org',
  42161: 'https://arb1.arbitrum.io/rpc',
  421613: 'https://goerli-rollup.arbitrum.io/rpc',
}
