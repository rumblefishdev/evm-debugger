import { all, takeLatest } from 'typed-redux-saga'

import { yulNodesActions } from './yulNodes.slice'
import { createYulNodesStructure } from './saga/createYulNodesStructure/createYulNodesStructure.saga'

export function* yulNodesMasterSaga(): Generator {
  yield all([takeLatest(yulNodesActions.createYulNodesStructure.type, createYulNodesStructure)])
}
