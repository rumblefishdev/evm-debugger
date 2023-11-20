import { select, type SagaGenerator, put, apply } from 'typed-redux-saga'

import { jsonRpcProvider } from '../../../../config'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { bytecodesSelectors } from '../../bytecodes.selectors'
import { bytecodesActions } from '../../bytecodes.slice'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../../analyzer/analyzer.const'

export function* fetchBytecodesSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching bytecodes' }))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_BYTECODES }))

    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const provider = jsonRpcProvider[chainId]

    const emptyBytecodes = yield* select(bytecodesSelectors.addressesWithMissingBytecode)

    for (const address of emptyBytecodes) {
      const bytecode = yield* apply(provider, provider.getCode, [address])
      yield* put(bytecodesActions.updateBytecode({ id: address, changes: { bytecode } }))
    }

    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.FETCHING_BYTECODES,
      }),
    )
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.SUCCESS, message: 'Fetching bytecodes success' }))
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.FETCHING_BYTECODES }))
    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.ERROR,
        message: `Error while fetching bytecodes analyzer: ${error.message}`,
      }),
    )
  }
}
