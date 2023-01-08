import {
  etherscanKey,
  etherscanUrl,
  jsonRpcProvider,
  transactionTraceProviderUrl,
} from '../config'
import {
  EtherscanAbiFetcher,
  JSONRpcBytecodeFetcher,
  JSONRpcTxInfoFetcher,
  TransactionTraceFetcher,
} from '../store/analyzer/analyzer.providers'
import type {
  IAbiProvider,
  IBytecodeProvider,
  IStructLogProvider,
  ITxInfoProvider,
} from '../store/analyzer/analyzer.types'

type SupportedChain = {
  name: string
  txInfoProvider: (hash: string) => ITxInfoProvider
  structLogProvider: (hash: string) => IStructLogProvider
  abiProvider?: IAbiProvider
  bytecodeProvider?: IBytecodeProvider
}

type ChainId = number

export const supportedChains: Record<ChainId, SupportedChain> = {
  1: {
    txInfoProvider: (hash: string) =>
      new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[1]),
    structLogProvider: (hash: string) =>
      new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 1),
    name: 'Ethereum',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[1]),
    abiProvider: new EtherscanAbiFetcher(etherscanUrl, etherscanKey),
  },
}
