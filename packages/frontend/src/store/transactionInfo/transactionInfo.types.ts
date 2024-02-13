import type { ChainId, TTransactionInfo } from '@evm-debuger/types'
import type { JsonRpcProvider } from 'ethers'

export type TTransactionInfoState = TTransactionInfo | null

export type TEthersTransactionReposnse = Pick<
  Awaited<ReturnType<JsonRpcProvider['getTransaction']>>,
  'blockNumber' | 'blockHash' | 'from' | 'hash' | 'data' | 'to' | 'value' | 'chainId' | 'nonce' | 'gasLimit'
>

export type TFetchTransactionInfoPayload = {
  transactionHash: string
  chainId: ChainId
}
