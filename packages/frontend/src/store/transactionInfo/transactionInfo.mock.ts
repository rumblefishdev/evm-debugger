import { v4 as createUUID } from 'uuid'
import { ChainId } from '@evm-debuger/types'

import type { TransactionInfoState } from './transactionInfo.state'

export const mockTransactionInfoState = (): TransactionInfoState => ({
  value: 'value',
  to: createUUID(),
  nonce: 0,
  input: createUUID(),
  hash: createUUID(),
  gasLimit: '44444',
  from: createUUID(),
  chainId: ChainId.mainnet,
  blockNumber: '',
  blockHash: createUUID(),
})
