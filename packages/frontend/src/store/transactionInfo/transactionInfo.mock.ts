import { v4 as createUUID } from 'uuid'
import { ChainId } from '@evm-debuger/types'

import type { TransactionInfoState } from './transactionInfo.state'

export const mockTransactionInfoState = (): TransactionInfoState => ({
  value: 'value',
  to: createUUID(),
  nonce: 0,
  input: createUUID(),
  hash: createUUID(),
  from: createUUID(),
  chainId: ChainId.mainnet,
  blockNumber: '',
  blockHash: createUUID(),
})
