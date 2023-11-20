import { all, takeLeading } from 'typed-redux-saga'

import { gatherContractsInformationsSaga } from './saga/gatherContractsInformations/gatherContractsInformations.saga'
import { processTransactionSaga } from './saga/processTransaction/processTransaction.saga'
import { runAnalyzerSaga } from './saga/runAnalyzer/runAnalyzer.saga'
import { analyzerActions } from './analyzer.slice'

export function* analyzerMasterSaga(): Generator {
  yield all([
    takeLeading(analyzerActions.runAnalyzer, runAnalyzerSaga),
    takeLeading(analyzerActions.processTransaction, processTransactionSaga),
    takeLeading(analyzerActions.gatherContractsInformations, gatherContractsInformationsSaga),
  ])
}
