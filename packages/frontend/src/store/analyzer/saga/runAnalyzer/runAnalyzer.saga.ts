import { select, type SagaGenerator, put, call } from 'typed-redux-saga'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import type { TTransactionData } from '@evm-debuger/types'

import { transactionInfoSelectors } from '../../../transactionInfo/transactionInfo.selectors'
import { structlogsSelectors } from '../../../structlogs/structlogs.selectors'
import { traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { activeBlockActions } from '../../../activeBlock/activeBlock.slice'
import { createCallIdentifier } from '../../../../helpers/helpers'
import { instructionsActions } from '../../../instructions/instructions.slice'
import { sourceMapsSelectors } from '../../../sourceMaps/sourceMaps.selectors'
import { sourceCodesSelectors } from '../../../sourceCodes/sourceCodes.selectors'
import { contractNamesSelectors } from '../../../contractNames/contractNames.selectors'
import { bytecodesSelectors } from '../../../bytecodes/bytecodes.selectors'
import { sighashSelectors } from '../../../sighash/sighash.selectors'
import { analyzerActions } from '../../analyzer.slice'
import { sighashActions } from '../../../sighash/sighash.slice'
import { abisSelectors } from '../../../abis/abis.selectors'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'

export function runAnalyzer(payload: TTransactionData) {
  const analyzer = new TxAnalyzer(payload)
  return analyzer.analyze()
}

export function* runAnalyzerSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Running analyzer')))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.RUNNING_ANALYZER }))

    const transactionInfo = yield* select(transactionInfoSelectors.selectTransactionInfo)
    const structLogs = yield* select(structlogsSelectors.selectAll)
    const sourceMaps = yield* select(sourceMapsSelectors.selectGroupedByAddress)
    const sourceFiles = yield* select(sourceCodesSelectors.selectParsedToSourceFiles)
    const contractNames = yield* select(contractNamesSelectors.selectGroupedByAddress)
    const bytecodes = yield* select(bytecodesSelectors.selectGroupedByAddress)
    const abis = yield* select(sighashSelectors.abis)
    const addionalAbis = yield* select(abisSelectors.selectGroupedByAddress)

    const analyzerPayload: TTransactionData = {
      transactionInfo,
      structLogs,
      sourceMaps,
      sourceFiles,
      contractNames,
      bytecodeMaps: bytecodes,
      abis: { ...abis, ...addionalAbis },
    }

    const { mainTraceLogList, instructionsMap, analyzeSummary } = yield* call(runAnalyzer, analyzerPayload)

    yield* put(sighashActions.addSighashes(analyzeSummary.contractSighashesInfo))

    yield* put(traceLogsActions.addTraceLogs(mainTraceLogList))
    yield* put(
      activeBlockActions.loadActiveBlock({
        ...mainTraceLogList[0],
        id: createCallIdentifier(mainTraceLogList[0].stackTrace, mainTraceLogList[0].type),
      }),
    )

    yield* put(
      instructionsActions.addInstructions(Object.entries(instructionsMap).map(([address, instructions]) => ({ instructions, address }))),
    )

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage('Analyzer finished')))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.RUNNING_ANALYZER,
      }),
    )
  } catch (error) {
    console.error(error)
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.RUNNING_ANALYZER }))
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while running analyzer: ${error.message}`)))
  }
}
