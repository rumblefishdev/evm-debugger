import { put, type SagaGenerator } from 'typed-redux-saga'

import type { TAnalyzerActions } from '../../analyzer.slice'
import { analyzerActions } from '../../analyzer.slice'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../analyzer.const'

export function* initializeTransactionProcessingSaga({
  payload,
}: TAnalyzerActions['initializeTransactionProcessing']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload

  try {
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.INITIALIZING_ANALYZER }),
    )
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Initializing analyzer' }))

    yield* put(transactionConfigActions.setChainId({ chainId }))
    yield* put(transactionConfigActions.setTransactionHash({ transactionHash }))

    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.INITIALIZING_ANALYZER }))
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.INITIALIZING_ANALYZER }))
    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.ERROR,
        message: `Error while initializing analyzer: ${error.message}`,
      }),
    )
    throw error
  }
}
