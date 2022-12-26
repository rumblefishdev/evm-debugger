import { all, takeLeading } from 'typed-redux-saga'

import { analyzerActions } from './analyzer.slice'
import { runAnalyzer } from './runAnalyzer.saga'

export function* analyzerMasterSaga(): Generator {
  yield all([takeLeading(analyzerActions.runAnalyzer.type, runAnalyzer)])
}
