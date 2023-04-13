/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */
import {
  etherscanUrls,
  jsonRpcProvider,
  transactionTraceProviderUrl,
} from '../config'
import {
  EtherscanSourceFetcher,
  JSONRpcBytecodeFetcher,
  JSONRpcTxInfoFetcher,
  TransactionTraceFetcher,
} from '../store/analyzer/analyzer.providers'
import type {
  ISourceProvider,
  IBytecodeProvider,
  IStructLogProvider,
  ITxInfoProvider,
} from '../store/analyzer/analyzer.types'

type SupportedChain = {
  name: string
  txInfoProvider: (hash: string) => ITxInfoProvider
  structLogProvider: (hash: string) => IStructLogProvider
  sourceProvider?: ISourceProvider
  bytecodeProvider?: IBytecodeProvider
}

type ChainId = number

export const supportedChains: Record<ChainId, SupportedChain> = {
  /** mainnet */
  1: {
    txInfoProvider: (hash: string) =>
      new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[1]),
    structLogProvider: (hash: string) =>
      new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 1),
    sourceProvider: new EtherscanSourceFetcher(
      etherscanUrls[1].url,
      etherscanUrls[1].key,
    ),
    name: 'Ethereum',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[1]),
  },

  /** goerli */
  5: {
    txInfoProvider: (hash: string) =>
      new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[5]),
    structLogProvider: (hash: string) =>
      new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 5),
    sourceProvider: new EtherscanSourceFetcher(
      etherscanUrls[5].url,
      etherscanUrls[5].key,
    ),
    name: 'Goerli',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[5]),
  },

  /** polygon */
  137: {
    txInfoProvider: (hash: string) =>
      new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[137]),
    structLogProvider: (hash: string) =>
      new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 137),
    sourceProvider: new EtherscanSourceFetcher(
      etherscanUrls[137].url,
      etherscanUrls[137].key,
    ),
    name: 'Polygon',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[137]),
  },

  /** mumbai */
  80001: {
    txInfoProvider: (hash: string) =>
      new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[80001]),
    structLogProvider: (hash: string) =>
      new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 80001),
    sourceProvider: new EtherscanSourceFetcher(
      etherscanUrls[80001].url,
      etherscanUrls[80001].key,
    ),
    name: 'Mumbai',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[80001]),
  },

  /** sepolia */
  11155111: {
    txInfoProvider: (hash: string) =>
      new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[11155111]),
    structLogProvider: (hash: string) =>
      new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 11155111),
    sourceProvider: new EtherscanSourceFetcher(
      etherscanUrls[11155111].url,
      etherscanUrls[11155111].key,
    ),
    name: 'Sepolia',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[11155111]),
  },

  // /** arbitrum one */
  // 42161: {
  //   txInfoProvider: (hash: string) =>
  //     new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[42161]),
  //   structLogProvider: (hash: string) =>
  //     new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 42161),
  //   sourceProvider: new EtherscanSourceFetcher(
  //     etherscanUrls[42161].url,
  //     etherscanUrls[42161].key,
  //   ),
  //   name: 'Arbitrum One',
  //   bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[42161]),
  // },

  // /** arbitrum goerli */
  // 421613: {
  //   txInfoProvider: (hash: string) =>
  //     new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[421613]),
  //   structLogProvider: (hash: string) =>
  //     new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 421613),
  //   sourceProvider: new EtherscanSourceFetcher(
  //     etherscanUrls[421613].url,
  //     etherscanUrls[421613].key,
  //   ),
  //   name: 'Arbitrum Rinkeby',
  //   bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[421613]),
  // },
}
