import { all, fork } from 'typed-redux-saga'

import { transactionInfoMasterSaga } from './transactionInfo/transactionInfo.saga'
import { structlogsMasterSaga } from './structlogs/structlogs.saga'
import { analyzerMasterSaga } from './analyzer/analyzer.master.saga'
import { yulNodesMasterSaga } from './yulNodes/yulNodes.saga'
import { contractRawMasterSaga } from './contractRaw/contractRaw.master.saga'

export function* rootSaga(): Generator {
  yield* all([
    fork(analyzerMasterSaga),
    fork(transactionInfoMasterSaga),
    fork(structlogsMasterSaga),
    fork(contractRawMasterSaga),
    fork(yulNodesMasterSaga),
  ])
}
