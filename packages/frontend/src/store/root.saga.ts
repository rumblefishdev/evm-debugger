import { all, fork } from 'typed-redux-saga'

import { bytescodesMasterSaga } from './bytecodes/bytecodes.master.saga'
import { transactionInfoMasterSaga } from './transactionInfo/transactionInfo.saga'
import { structlogsMasterSaga } from './structlogs/structlogs.saga'
import { analyzerMasterSaga } from './analyzer/analyzer.master.saga'
import { sourceCodesMasterSaga } from './sourceCodes/sourceCodes.master.saga'

export function* rootSaga(): Generator {
  yield* all([
    fork(bytescodesMasterSaga),
    fork(analyzerMasterSaga),
    fork(transactionInfoMasterSaga),
    fork(structlogsMasterSaga),
    fork(sourceCodesMasterSaga),
  ])
}
