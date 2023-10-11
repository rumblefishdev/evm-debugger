export const API_KEYS = {
  polygon: process.env.POLYGONSCAN_KEY || process.env.REACT_APP_POLYGONSCAN_KEY,
  ethereum: process.env.ETHERSCAN_KEY || process.env.REACT_APP_ETHERSCAN_KEY,
  arbitrum: process.env.ARBITRUMSCAN_KEY || process.env.REACT_APP_ARBITRUMSCAN_KEY,
  alchemy: process.env.ALCHEMY_KEY || process.env.REACT_APP_ALCHEMY_KEY,
}

export const CONFIG = {
  evmSentryDsn: process.env.EVM_SENTRY_DSN || process.env.REACT_APP_EVM_SENTRY_DSN,
  evmDebuggerUrl: process.env.EVM_DEBUGGER_URL || process.env.REACT_APP_EVM_DEBUGGER_URL,
  contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID || process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT || process.env.REACT_APP_CONTENTFUL_ENVIRONMENT,
  contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN || process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
}
