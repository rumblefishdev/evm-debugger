import { all, fork } from 'typed-redux-saga'

import { bytescodesMasterSaga } from './bytecodes/bytecodes.master.saga'

export function* rootSaga(): Generator {
  yield all([fork(bytescodesMasterSaga)])
}
