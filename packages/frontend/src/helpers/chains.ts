/* eslint-disable unicorn/numeric-separators-style, sort-keys-fix/sort-keys-fix */
import { ChainId } from '@evm-debuger/types'

import { chainNames, jsonRpcProvider, transactionTraceProviderUrl, srcMapProviderUrl } from '../config'
import {
  JSONRpcBytecodeFetcher,
  JSONRpcTxInfoFetcher,
  TransactionTraceFetcher,
  ContractSourceFetcher,
} from '../store/analyzer/analyzer.providers'
import type { IContractSourceProvider, IBytecodeProvider, IStructLogProvider, ITxInfoProvider } from '../store/analyzer/analyzer.types'

type SupportedChain = {
  name: string
  txInfoProvider: (hash: string) => ITxInfoProvider
  structLogProvider: (hash: string) => IStructLogProvider
  sourceProvider?: IContractSourceProvider
  bytecodeProvider?: IBytecodeProvider
}

export const supportedChains = Object.fromEntries(
  [
    ChainId.mainnet,
    ChainId.goerli,
    ChainId.polygon,
    ChainId.mumbai,
    ChainId.sepolia,
    // ChainId.arbitrum, // TODO
    // ChainId.arbitrumGoerli, // TODO
  ].map((chainId): [ChainId, SupportedChain] => [
    chainId,
    {
      name: chainNames[chainId],
      txInfoProvider: (hash: string) => new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[chainId]),
      structLogProvider: (hash: string) => new TransactionTraceFetcher(transactionTraceProviderUrl, hash, chainId),
      sourceProvider: new ContractSourceFetcher(srcMapProviderUrl, chainId),
      bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[chainId]),
    },
  ]),
) as unknown as Record<ChainId, SupportedChain>
