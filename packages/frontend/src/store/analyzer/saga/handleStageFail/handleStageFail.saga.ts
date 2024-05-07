import { call, put, select, type SagaGenerator } from 'typed-redux-saga'

import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createErrorLogMessage, sendStatusMessageToDiscord } from '../../analyzer.utils'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { analyzerActions } from '../../analyzer.slice'

export function* handleStageFailSaga(stageName: AnalyzerStages, error: Error): SagaGenerator<void> {
  console.log(error)
  const transactionHash = yield* select(transactionConfigSelectors.selectTransactionHash)
  const chainId = yield* select(transactionConfigSelectors.selectChainId)

  yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName }))
  yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Run failed on ${stageName} with reason: ${error.message}`)))

  yield* call(
    sendStatusMessageToDiscord,
    `Analyzer run for ${transactionHash} on chainId ${chainId} failed at ${AnalyzerStages.INITIALIZING_ANALYZER} stage with error: ${error.message}`,
  )
}
