import type { ChainId, TransactionTraceResponseStatus } from '@evm-debuger/types'

export type TFetchStructlogsPayload = {
  s3Location: string
}

export type TFetchStructlogsLocationPayload = {
  transactionHash: string
  chainId: ChainId
}

// chainId
// :
// "1"
// s3Location
// :
// "transaction-trace-storage-stage.rumblefish.dev/trace/1/0xf1bd078875698b8ec4dca853cc0cac480d6bdc31fa4442202998626eadba176c.json"
// status
// :
// "SUCCESS"
// timestamp
// :
// "1700423245703"
// txHash
// :
// "0xf1bd078875698b8ec4dca853cc0cac480d6bdc31fa4442202998626eadba176c"
// type#time
// :
// "EVENT#1700423245703"

export type TStructlogResponse = {
  chainId: ChainId
  s3Location?: string
  status: TransactionTraceResponseStatus
  timestamp: string
  txHash: string
  'type#time': string
}
