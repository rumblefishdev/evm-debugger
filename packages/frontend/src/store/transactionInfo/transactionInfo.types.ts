import type { ChainId, TTransactionInfo } from '@evm-debuger/types'

export type TTransactionInfoState = TTransactionInfo | null

export type TFetchTransactionInfoPayload = {
  transactionHash: string
  chainId: ChainId
}
