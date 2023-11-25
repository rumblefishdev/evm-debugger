import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import type { TAnalyzerActions } from '../../analyzer.slice'
import { analyzerActions } from '../../analyzer.slice'

export const processTransactionTakesMatchers = {
  [AnalyzerStages.INITIALIZING_ANALYZER]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.INITIALIZING_ANALYZER &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
  [AnalyzerStages.FETCHING_TRANSACTION_INFO]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.FETCHING_TRANSACTION_INFO &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
  [AnalyzerStages.PREPARING_STRUCTLOGS]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.PREPARING_STRUCTLOGS &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
  [AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
  [AnalyzerStages.GATHERING_CONTRACTS_INFORMATION]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.GATHERING_CONTRACTS_INFORMATION &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
  [AnalyzerStages.FETCHING_BYTECODES]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.FETCHING_BYTECODES &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
  [AnalyzerStages.FETCHING_SOURCE_CODES]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.FETCHING_SOURCE_CODES &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
  [AnalyzerStages.RUNNING_ANALYZER]: (action: TAnalyzerActions['updateStage']) =>
    action.type === analyzerActions.updateStage.type &&
    action.payload.stageName === AnalyzerStages.RUNNING_ANALYZER &&
    action.payload.stageStatus === AnalyzerStagesStatus.SUCCESS,
}
