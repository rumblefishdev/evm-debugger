import { apply, select, type SagaGenerator, put } from 'typed-redux-saga'
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
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../analyzer.const'

export function* runAnalyzerSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Running analyzer' }))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.RUNNING_ANALYZER }))

    const transactionInfo = yield* select(transactionInfoSelectors.selectTransactionInfo)
    const structLogs = yield* select(structlogsSelectors.selectAll)
    const sourceMaps = yield* select(sourceMapsSelectors.selectGroupedByAddress)
    const sourceCodes = yield* select(sourceCodesSelectors.selectGroupedByAddress)
    const contractNames = yield* select(contractNamesSelectors.selectGroupedByAddress)
    const bytecodes = yield* select(bytecodesSelectors.selectGroupedByAddress)
    const abis = yield* select(sighashSelectors.abis)
    const addionalAbis = yield* select(abisSelectors.selectGroupedByAddress)

    const analyzerPayload: TTransactionData = {
      transactionInfo,
      structLogs,
      sourceMaps,
      sourceCodes,
      contractNames,
      bytecodeMaps: bytecodes,
      abis: { ...abis, ...addionalAbis },
    }
    // fix for Buffer not defined
    window.Buffer = window.Buffer || Buffer
    const analyzer = new TxAnalyzer(analyzerPayload)
    const { mainTraceLogList, instructionsMap, analyzeSummary } = yield* apply(analyzer, analyzer.analyze, [])

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

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Analyzer finished' }))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.RUNNING_ANALYZER,
      }),
    )
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.RUNNING_ANALYZER }))
    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.ERROR,
        message: `Error while running analyzer: ${error.message}`,
      }),
    )
  }
}
