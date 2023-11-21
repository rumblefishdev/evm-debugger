import { put, take, type SagaGenerator } from 'typed-redux-saga'

import { analyzerActions, type TAnalyzerActions } from '../../analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'
import { createErrorLogMessage, createInfoLogMessage } from '../../analyzer.utils'

export function* processTransactionSaga({ payload }: TAnalyzerActions['processTransaction']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload

  try {
    yield* put(analyzerActions.initializeTransactionProcessing(payload))
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.INITIALIZING_ANALYZER &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )

    yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Running transaction: ${transactionHash} on chain: ${chainId}`)))

    yield* put(transactionInfoActions.fetchTransactionInfo())
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.FETCHING_TRANSACTION_INFO &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )

    yield* put(structLogsActions.startPreparingStructlogs())
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.PREPARING_STRUCTLOGS &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )

    yield* put(structLogsActions.fetchStructlogs())
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )

    yield* put(analyzerActions.gatherContractsInformations())
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.GATHERING_CONTRACTS_INFORMATION &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )

    yield* put(bytecodesActions.fetchBytecodes())
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.FETCHING_BYTECODES &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )

    yield* put(sourceCodesActions.fetchSourceCodes())
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.FETCHING_SOURCE_CODES &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )

    yield* put(analyzerActions.runAnalyzer())
    yield* take(
      (action: TAnalyzerActions['updateStage']) =>
        action.type === analyzerActions.updateStage.type &&
        action.payload.stageName === AnalyzerStages.RUNNING_ANALYZER &&
        action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
    )
  } catch (error) {
    yield* put(analyzerActions.setCriticalError(error.message))
    yield* put(
      analyzerActions.addLogMessage(createErrorLogMessage(`Error while processing transaction: ${transactionHash} on chain: ${chainId}`)),
    )
  }
}
