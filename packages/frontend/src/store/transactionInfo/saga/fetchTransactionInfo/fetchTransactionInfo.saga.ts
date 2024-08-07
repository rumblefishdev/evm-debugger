import type { ChainId, TTransactionInfo } from '@evm-debuger/types'
import { put, select, type SagaGenerator, call, apply } from 'typed-redux-saga'

import { jsonRpcProvider } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import {
  createInfoLogMessage,
  createSuccessLogMessage,
  createWarningLogMessage,
  getAnalyzerInstance,
} from '../../../analyzer/analyzer.utils'
import { formatTransactionReposne } from '../../transactionInfo.utils'
import { TransactionInfoErrors } from '../../transactionInfo.errors'
import { handleStageFailSaga } from '../../../analyzer/saga/handleStageFail/handleStageFail.saga'

export async function getTransactionInfo(transactionHash: string, chainId: ChainId): Promise<TTransactionInfo> {
  const provider = jsonRpcProvider[chainId]

  const transactionInfo = await provider.getTransaction(transactionHash)

  if (!transactionInfo) {
    throw new Error(TransactionInfoErrors.TRANSACTION_NOT_FOUND)
  }

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

    const analyzer = yield* call(getAnalyzerInstance)
    yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputTransactionData.set, [formattedTransactionInfo])

    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )
    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage('Transaction data fetched')))
  } catch (error) {
    if (error instanceof Error && error.message === TransactionInfoErrors.TRANSACTION_NOT_FOUND) {
      yield* put(
        analyzerActions.addLogMessage(createWarningLogMessage('Most likely you are trying to analyze transaction on the wrong network')),
      )
    }
    yield* call(handleStageFailSaga, AnalyzerStages.FETCHING_TRANSACTION_INFO, error)
  }
}
