import { all } from 'typed-redux-saga'
import { takeEvery } from 'redux-saga/effects'

import { sourceMapsActions } from './sourceMaps.slice'
import { fetchSourceMapsForContractSaga } from './saga/fetchSourceMaps/fetchSourceMaps.saga'

export function* sourceMapsMasterSaga(): Generator {
  yield all([takeEvery(sourceMapsActions.fetchSourceMaps, fetchSourceMapsForContractSaga)])
}
