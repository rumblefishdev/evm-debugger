import { all, takeLatest } from 'typed-redux-saga'

import { gatherContractsInformationsSaga } from './saga/gatherContractsInformations/gatherContractsInformations.saga'
import { processTransactionSaga } from './saga/processTransaction/processTransaction.saga'
import { runAnalyzerSaga } from './saga/runAnalyzer/runAnalyzer.saga'
import { analyzerActions } from './analyzer.slice'
import { initializeTransactionProcessingSaga } from './saga/initializeTransactionProcessing/initializeTransactionProcessing.saga'
import { clearAnalyzerInformationSaga } from './saga/clearAnalyzerInformation/clearAnalyzerInformation.saga'

export function* analyzerMasterSaga(): Generator {
  yield* all([
    takeLatest(analyzerActions.runAnalyzer, runAnalyzerSaga),
    takeLatest(analyzerActions.processTransaction, processTransactionSaga),
    takeLatest(analyzerActions.gatherContractsInformations, gatherContractsInformationsSaga),
    takeLatest(analyzerActions.initializeTransactionProcessing, initializeTransactionProcessingSaga),
    takeLatest(analyzerActions.clearAnalyzerInformation, clearAnalyzerInformationSaga),
  ])
}
