import { all, takeLeading } from 'typed-redux-saga'

import { analyzerActions } from './analyzer.slice'
import { regenerateAnalyzer, runAnalyzer } from './runAnalyzer.saga'

export function* analyzerMasterSaga(): Generator {
  yield all([
    takeLeading(analyzerActions.runAnalyzer.type, runAnalyzer),
    takeLeading(analyzerActions.regenerateAnalyzer.type, regenerateAnalyzer),
  ])
}
