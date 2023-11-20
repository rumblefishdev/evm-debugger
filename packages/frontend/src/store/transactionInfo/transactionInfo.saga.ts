import { all, takeLeading } from 'typed-redux-saga'

import { transactionInfoActions } from './transactionInfo.slice'
import { fetchTransactionInfoSaga } from './saga/fetchTransactionInfo/fetchTransactionInfo.saga'

export function* transactionInfoMasterSaga(): Generator {
  yield all([takeLeading(transactionInfoActions.fetchTransactionInfo.type, fetchTransactionInfoSaga)])
}
