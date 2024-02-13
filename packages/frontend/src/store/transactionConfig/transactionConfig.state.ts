import type { ChainId } from '@evm-debuger/types'

import type { TTransactionConfigState } from './transactionConfig.types'

export class TransactionConfigState implements TTransactionConfigState {
  chainId: ChainId
  transactionHash: string
  s3Location: string
  gasLimit: bigint
}
