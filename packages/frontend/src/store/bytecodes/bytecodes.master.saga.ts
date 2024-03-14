import { all, takeLatest } from 'typed-redux-saga'

import { fetchBytecodesSaga } from './saga/fetchBytecodes/fetchBytecodes.saga'
import { bytecodesActions } from './bytecodes.slice'

export function* bytescodesMasterSaga(): Generator {
  yield all([takeLatest(bytecodesActions.fetchBytecodes, fetchBytecodesSaga)])
}
