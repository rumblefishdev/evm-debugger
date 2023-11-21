import { select, type SagaGenerator, put, apply, take } from 'typed-redux-saga'

import { jsonRpcProvider } from '../../../../config'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { bytecodesSelectors } from '../../bytecodes.selectors'
import { bytecodesActions } from '../../bytecodes.slice'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'

export function* fetchBytecodesSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Fetching bytecodes')))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_BYTECODES }))

    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const provider = jsonRpcProvider[chainId]

    const emptyBytecodes = yield* select(bytecodesSelectors.addressesWithMissingBytecode)

    for (const address of emptyBytecodes) {
      const bytecode = yield* apply(provider, provider.getCode, [address])
      yield* put(bytecodesActions.updateBytecode({ id: address, changes: { bytecode } }))
      // Temporary fix to wait for bytecode dissasembly
      yield* take(bytecodesActions.updateBytecode)
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
