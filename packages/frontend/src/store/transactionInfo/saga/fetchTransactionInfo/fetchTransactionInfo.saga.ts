import type { ChainId, TTransactionInfo } from '@evm-debuger/types'
import { put, select, type SagaGenerator, call } from 'typed-redux-saga'

import { transactionInfoActions } from '../../transactionInfo.slice'
import { jsonRpcProvider } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { formatTransactionReposne } from '../../transactionInfo.utils'

export async function getTransactionInfo(transactionHash: string, chainId: ChainId): Promise<TTransactionInfo> {
  const provider = jsonRpcProvider[chainId]

  const transactionInfo = await provider.getTransaction(transactionHash)

  return formatTransactionReposne(transactionInfo)
}

export function* fetchTransactionInfoSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Fetching transaction data')))
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )

    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const transactionHash = yield* select(transactionConfigSelectors.selectTransactionHash)

    if (!chainId) {
      throw new Error('Chain id is not set')
    }

    if (!transactionHash) {
      throw new Error('Transaction hash is not set')
    }

    const formattedTransactionInfo = yield* call(getTransactionInfo, transactionHash, chainId)

    yield* put(transactionInfoActions.setTransactionInfo(formattedTransactionInfo))

    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )
    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage('Transaction data fetched')))
  } catch (error) {
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while fetch transaction info: ${error.message}`)))
  }
}
