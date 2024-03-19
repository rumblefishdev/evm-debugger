import { all, takeEvery, takeLatest } from 'typed-redux-saga'

import { contractRawActions } from './contractRaw.slice'
import { fetchSourceMapsForContractSaga } from './saga/fetchSourceMaps/fetchSourceMaps.saga'
import { startPoolingSourcesStatusSaga } from './saga/fetchSourceCodes/fetchSourceCodes.saga'
import { fetchSourceDataForContractSaga } from './saga/fetchSourceData/fetchSourceData.saga'
import { fetchBytecodesSaga } from './saga/fetchBytecodes/fetchBytecodes.saga'

export function* contractRawMasterSaga(): Generator {
  yield all([
    takeEvery(contractRawActions.fetchSourceMaps, fetchSourceMapsForContractSaga),
    takeLatest(contractRawActions.startPoolingSources, startPoolingSourcesStatusSaga),
    takeEvery(contractRawActions.fetchSourceData, fetchSourceDataForContractSaga),
    takeLatest(contractRawActions.fetchBytecodes, fetchBytecodesSaga),
  ])
}
