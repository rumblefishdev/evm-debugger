import { type SagaGenerator, put, call } from 'typed-redux-saga'

import { traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { activeBlockActions } from '../../../activeBlock/activeBlock.slice'
import { createCallIdentifier } from '../../../../helpers/helpers'
import { instructionsActions } from '../../../instructions/instructions.slice'
import { analyzerActions } from '../../analyzer.slice'
import { sighashActions } from '../../../sighash/sighash.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../analyzer.utils'
import { activeLineActions } from '../../../activeLine/activeLine.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { contractsActions } from '../../../contracts/contracts.slice'
import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'

export function runAnalyzer() {
  const analyzer = getAnalyzerInstance()
  return analyzer.runFullAnalysis()
}

export function* runAnalyzerSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Running analyzer')))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.RUNNING_ANALYZER }))

    const {
      traceLogs,
      transactionInfo,
      contractsInstructions,
      contractsStructLogsPerLine,
      structLogs,
      contractsDisassembledBytecodes,
      contractsBaseData,
      contractsSettings,
    } = yield* call(runAnalyzer)

    // yield* put(sighashActions.addSighashes(contractSighashes))
    yield* put(structLogsActions.loadStructLogs(structLogs))

    yield* put(
      contractsActions.updateContracts(Object.values(contractsBaseData).map(({ address, ...changes }) => ({ id: address, changes }))),
    )

    yield* put(bytecodesActions.loadBytecodes(contractsDisassembledBytecodes))

    yield* put(traceLogsActions.addTraceLogs(traceLogs))
    yield* put(
      activeBlockActions.loadActiveBlock({
        ...traceLogs[0],
        id: createCallIdentifier(traceLogs[0].stackTrace, traceLogs[0].op),
      }),
    )

    yield* put(transactionInfoActions.setTransactionInfo(transactionInfo))

    yield* put(instructionsActions.addInstructions(contractsInstructions))
    yield* put(activeLineActions.setStructlogsPerActiveLine(contractsStructLogsPerLine))

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
