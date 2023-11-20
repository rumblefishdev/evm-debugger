import type { TTransactionInfo } from '@evm-debuger/types'
import { call, put, type SagaGenerator } from 'typed-redux-saga'

import type { TTransactionInfoActions } from '../../transactionInfo.slice'
import { transactionInfoActions } from '../../transactionInfo.slice'
import { jsonRpcProvider } from '../../../../config'

export function* fetchTransactionInfoSaga({ payload }: TTransactionInfoActions['fetchTransactionInfo']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload
  const provider = jsonRpcProvider[chainId]

  const transactionInfo = yield* call(provider.getTransaction, transactionHash)

  const formattedTransactionInfo: TTransactionInfo = {
    ...transactionInfo,
    value: transactionInfo.value.toHexString(),
    blockNumber: transactionInfo.blockNumber.toString(),
  }

  yield* put(transactionInfoActions.setTransactionInfo(formattedTransactionInfo))
}
