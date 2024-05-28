import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { ChainId } from '@evm-debuger/types'

import type { TAnalyzerActions } from '../../analyzer.slice'
import { analyzerActions } from '../../analyzer.slice'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'
import { jsonRpcProvider } from '../../../../config'
import { handleStageFailSaga } from '../handleStageFail/handleStageFail.saga'

export async function estimateGasUsage(chainId: ChainId, transactionHash: string): Promise<bigint> {
  const provider = jsonRpcProvider[chainId]

  const transactionReceiptResult = await provider.getTransactionReceipt(transactionHash)

  if (!transactionReceiptResult) {
    throw new Error('Transaction receipt not found')
  }

  return transactionReceiptResult.gasUsed
}

export function* initializeTransactionProcessingSaga({
  payload,
}: TAnalyzerActions['initializeTransactionProcessing']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload

  try {
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.INITIALIZING_ANALYZER }),
    )
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Initializing analyzer')))

    yield* put(transactionConfigActions.setChainId({ chainId }))
    yield* put(transactionConfigActions.setTransactionHash({ transactionHash }))

    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Calculating gas usage of transaction')))

    // const gasUsed = yield* call(estimateGasUsage, chainId, transactionHash)

    // if (gasUsed > BigInt(2000000)) {
    //   throw new Error(`Currently, we do not support transactions with over 2 milion gas usage. Your transaction used ${gasUsed} gas`)
    // }

    yield* put(transactionConfigActions.setGasUsed({ gasUsed: '100000' }))

    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.INITIALIZING_ANALYZER }))
    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage('Analyzer initialized')))
  } catch (error) {
    yield* call(handleStageFailSaga, AnalyzerStages.INITIALIZING_ANALYZER, error)
  }
}
