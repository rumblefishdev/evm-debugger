import {
  etherscanKey,
  etherscanUrl,
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
  1: {
    txInfoProvider: (hash: string) =>
      new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[1]),
    structLogProvider: (hash: string) =>
      new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 1),
    sourceProvider: new EtherscanSourceFetcher(etherscanUrl, etherscanKey),
    name: 'Ethereum',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[1]),
  },
}
