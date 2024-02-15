import { call, delay, put, select, type SagaGenerator } from 'typed-redux-saga'
import { TransactionTraceResponseStatus, type ChainId } from '@evm-debuger/types'
import fetch from 'node-fetch'

import type { TStructlogResponse } from '../../structlogs.types'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { transactionTraceProviderUrl } from '../../../../config'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import {
  createErrorLogMessage,
  createInfoLogMessage,
  createSuccessLogMessage,
  createWarningLogMessage,
} from '../../../analyzer/analyzer.utils'
import { StructlogsErrors } from '../../structlogs.errors'

export async function prepareStructlogs(chainId: ChainId, transactionHash: string, gasLimit: string): Promise<TStructlogResponse> {
  const response = await fetch(`${transactionTraceProviderUrl}/analyzerData/${transactionHash}/${chainId}/${gasLimit}`)
  const responseJson: TStructlogResponse = await response.json()

  return responseJson
}

export function* startPreparingStructlogsSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Preparing structLogs')))
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.PREPARING_STRUCTLOGS }),
    )
    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const transactionHash = yield* select(transactionConfigSelectors.selectTransactionHash)
    const gasLimit = yield* select(transactionConfigSelectors.selectGasLimit)
    while (true) {
      let shouldBreak = false

      const response = yield* call(prepareStructlogs, chainId, transactionHash, gasLimit)
      const { status } = response

      switch (status) {
        case TransactionTraceResponseStatus.PENDING:
        case TransactionTraceResponseStatus.RUNNING:
          yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Preparing structLogs status: ${status}`)))
          yield* delay(15_000)
          break
        case TransactionTraceResponseStatus.FAILED:
          throw new Error(response.errorDetails)
        case TransactionTraceResponseStatus.SUCCESS:
          shouldBreak = true
          yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Preparing structLogs status: ${status}`)))
          yield* put(
            analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.PREPARING_STRUCTLOGS }),
          )
          yield* put(transactionConfigActions.setS3Location({ s3Location: response.s3Location }))
          break
        default:
          throw new Error(`Unknown status: ${status}`)
      }

      if (shouldBreak) {
        break
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === StructlogsErrors.BLOCK_NOT_FOUND) {
      yield* put(
        analyzerActions.addLogMessage(
          createWarningLogMessage(
            `It looks like you trying to analyze transaction from latest block. Sometimes the Alechemy nodes that we use are a bit behind and don't have the latest block. Please try again in a few minutes. If you still see this error, please contact us at our discord server: https://discord.gg/c4fSnd22`,
          ),
        ),
      )
    }

    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.PREPARING_STRUCTLOGS }))
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while preparing structlogs: ${error.message}`)))
  }
}
