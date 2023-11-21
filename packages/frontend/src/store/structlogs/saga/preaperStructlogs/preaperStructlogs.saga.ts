import { call, delay, put, select, type SagaGenerator } from 'typed-redux-saga'
import { TransactionTraceResponseStatus, type ChainId } from '@evm-debuger/types'

import type { TStructlogResponse } from '../../structlogs.types'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { transactionTraceProviderUrl } from '../../../../config'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'

export async function preaperStructlogs(chainId: ChainId, transactionHash: string): Promise<TStructlogResponse> {
  const response = await fetch(`${transactionTraceProviderUrl}/analyzerData/${transactionHash}/${chainId}`)
  const responseJson: TStructlogResponse = await response.json()

  return responseJson
}

export function* prepareStructlogsSaga(): SagaGenerator<void> {
  const chainId = yield* select(transactionConfigSelectors.selectChainId)
  const transactionHash = yield* select(transactionConfigSelectors.selectTransactionHash)

  const response = yield* call(preaperStructlogs, chainId, transactionHash)
  const { status } = response

  if (status === TransactionTraceResponseStatus.PENDING || status === TransactionTraceResponseStatus.RUNNING) {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Preapering structLogs status: ${status}`)))
    yield* delay(15_000)
    yield* call(prepareStructlogsSaga)
  }

  if (status === TransactionTraceResponseStatus.FAILED) {
    throw new Error(response.errorDetails)
  }

  if (status === TransactionTraceResponseStatus.SUCCESS) {
    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Preapering structLogs status: ${status}`)))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.PREAPERING_STRUCTLOGS }))
    yield* put(transactionConfigActions.setS3Location({ s3Location: response.s3Location }))
  }
}

export function* startPreaperingStructlogsSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Preapering structLogs')))
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.PREAPERING_STRUCTLOGS }),
    )
    yield* call(prepareStructlogsSaga)
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.PREAPERING_STRUCTLOGS }))
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while preapering structlogs: ${error.message}`)))
  }
}
