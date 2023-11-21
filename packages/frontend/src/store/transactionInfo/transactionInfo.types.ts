import type { ChainId, TTransactionInfo } from '@evm-debuger/types'
import type { ethers } from 'ethers'

export type TTransactionInfoState = TTransactionInfo | null

export type TEthersTransactionReposnse = Awaited<ReturnType<ethers.providers.StaticJsonRpcProvider['getTransaction']>>

export type TFetchTransactionInfoPayload = {
  transactionHash: string
  chainId: ChainId
}
