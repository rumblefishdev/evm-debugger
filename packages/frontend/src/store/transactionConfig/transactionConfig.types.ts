import type { ChainId } from '@evm-debuger/types'

export type TTransactionConfigState = {
  chainId?: ChainId
  transactionHash?: string
  s3Location?: string
  gasUsed?: string
}

export type TSetTransactionHashPayload = {
  transactionHash: string
}

export type TSetS3LocationPayload = {
  s3Location: string
}

export type TSetChainIdPayload = {
  chainId: ChainId
}

export type TSetGasUsedPayload = {
  gasUsed: string
}
