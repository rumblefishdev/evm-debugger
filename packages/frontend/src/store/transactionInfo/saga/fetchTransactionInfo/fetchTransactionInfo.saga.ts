import type { TTransactionInfo } from '@evm-debuger/types'
import { apply, put, select, type SagaGenerator } from 'typed-redux-saga'

import { transactionInfoActions } from '../../transactionInfo.slice'
import { jsonRpcProvider } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'

export function* fetchTransactionInfoSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching transaction data' }))
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )

    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const transactionHash = yield* select(transactionConfigSelectors.selectTransactionHash)

    const provider = jsonRpcProvider[chainId]

    const transactionInfo = yield* apply(provider, provider.getTransaction, [transactionHash])

    const formattedTransactionInfo: TTransactionInfo = {
      ...transactionInfo,
      value: transactionInfo.value.toHexString(),
      input: transactionInfo.data,
      blockNumber: transactionInfo.blockNumber.toString(),
    }

    yield* put(transactionInfoActions.setTransactionInfo(formattedTransactionInfo))

    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.SUCCESS, message: 'Transaction data fetched' }))
  } catch (error) {
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )
    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.ERROR,
        message: `Error while fetch transaction info: ${error.message}`,
      }),
    )
  }
}
