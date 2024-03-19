/* eslint-disable no-return-await */
import { select, type SagaGenerator, put, call, apply } from 'typed-redux-saga'
import type { ChainId } from '@evm-debuger/types'

import { jsonRpcProvider } from '../../../../config'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'
import { contractBaseSelectors } from '../../../contractBase/contractBase.selectors'

export async function fetchBytecode(chainId: ChainId, address: string): Promise<string> {
  const provider = jsonRpcProvider[chainId]
  return await provider.getCode(address)
}

export function* fetchBytecodesSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Fetching bytecodes')))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_BYTECODES }))

    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const contractAddresses = yield* select(contractBaseSelectors.selectAllAddresses)

    const analyzer = yield* call(getAnalyzerInstance)

    for (const address of contractAddresses) {
      const bytecode = yield* call(fetchBytecode, chainId, address)
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [address, 'etherscanBytecode', bytecode])
    }

    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.FETCHING_BYTECODES,
      }),
    )
    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage('Fetching bytecodes success')))
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.FETCHING_BYTECODES }))
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while fetching bytecodes: ${error.message}`)))
  }
}
