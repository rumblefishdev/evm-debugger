/* eslint-disable no-return-await */
import { select, type SagaGenerator, put, take, call, apply } from 'typed-redux-saga'
import type { ChainId } from '@evm-debuger/types'

import { jsonRpcProvider } from '../../../../config'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { bytecodesSelectors } from '../../bytecodes.selectors'
import { bytecodesActions } from '../../bytecodes.slice'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'

export async function fetchBytecode(chainId: ChainId, address: string): Promise<string> {
  const provider = jsonRpcProvider[chainId]
  return await provider.getCode(address)
}

export function* fetchBytecodesSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Fetching bytecodes')))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_BYTECODES }))

    const chainId = yield* select(transactionConfigSelectors.selectChainId)

    const emptyBytecodes = yield* select(bytecodesSelectors.addressesWithMissingBytecode)

    const analyzer = yield* call(getAnalyzerInstance)

    for (const address of emptyBytecodes) {
      const bytecode = yield* call(fetchBytecode, chainId, address)

      yield* apply(analyzer.dataLoader, analyzer.dataLoader.loadContractEtherscanBytecode, [address, bytecode])
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
