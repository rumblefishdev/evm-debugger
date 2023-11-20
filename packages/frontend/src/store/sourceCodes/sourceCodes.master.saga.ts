import { all, takeLatest } from 'typed-redux-saga'

import { fetchSourceCodesSaga } from './saga/fetchSourceCodes/fetchSourceCodes.saga'
import { sourceCodesActions } from './sourceCodes.slice'

export function* sourceCodesMasterSaga(): Generator {
  yield all([takeLatest(sourceCodesActions.fetchSourceCodes, fetchSourceCodesSaga)])
}
