import type { ChainId, TransactionTraceResponseStatus } from '@evm-debuger/types'

import type { IExtendedStructLog } from '../../types'

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

export type TStructlogWithListIndex = IExtendedStructLog & { listIndex: number }
