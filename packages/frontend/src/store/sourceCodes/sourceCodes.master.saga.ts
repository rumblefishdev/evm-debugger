import { all, takeLatest } from 'typed-redux-saga'
import { takeEvery } from 'redux-saga/effects'

import { startPoolingSourcesStatusSaga } from './saga/fetchSourceCodes/fetchSourceCodes.saga'
import { sourceCodesActions } from './sourceCodes.slice'
import { fetchSourceDataForContractSaga } from './saga/fetchSourceData/fetchSourceData.saga'

export function* sourceCodesMasterSaga(): Generator {
  yield all([
    takeLatest(sourceCodesActions.startPoolingSources.type, startPoolingSourcesStatusSaga),
    takeEvery(sourceCodesActions.fetchSourceData.type, fetchSourceDataForContractSaga),
  ])
}
