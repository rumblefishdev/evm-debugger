import { all, fork } from 'typed-redux-saga'

import { analyzerMasterSaga } from './analyzer/analyzer.master.saga'
import { bytescodesMasterSaga } from './bytecodes/bytecodes.master.saga'

export function* rootSaga(): Generator {
  yield all([fork(bytescodesMasterSaga), fork(analyzerMasterSaga)])
}
