import type { ChainId, TransactionTraceResponseStatus } from '@evm-debuger/types'

export type TFetchStructlogsPayload = {
  s3Location: string
}

export type TFetchStructlogsLocationPayload = {
  transactionHash: string
  chainId: ChainId
}

export type TStructlogResponse = {
  chainId: ChainId
  s3Location?: string
  status: TransactionTraceResponseStatus
  timestamp: string
  txHash: string
  'type#time': string
  errorDetails?: string
}
