import { createEntityAdapter } from '@reduxjs/toolkit'

import type { IAnalyzerState, TAnalyzerLogMessages, TAnalyzerStages, TLogMessageRecord, TStageRecord } from './analyzer.types'
import { AnalyzerStages, AnalyzerStagesStatus } from './analyzer.const'

export const analyzerStagesAdapter = createEntityAdapter<TStageRecord>({ selectId: (stage) => stage.stageName })
export const analyzerLogMessagesAdapter = createEntityAdapter<TLogMessageRecord>({ selectId: (message) => message.identifier })

export const INITIAL_STAGES: TStageRecord[] = [
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.INITIALIZING_ANALYZER },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.PREAPERING_STRUCTLOGS },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.FETCHING_BYTECODES },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.FETCHING_SOURCE_CODES },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.RUNNING_ANALYZER },
]

export const emptyStagesState = analyzerStagesAdapter.getInitialState()
export const initializedStagesState = analyzerStagesAdapter.setAll(emptyStagesState, INITIAL_STAGES)

export const emptyLogMessagesState = analyzerLogMessagesAdapter.getInitialState()
export class AnalyzerState implements IAnalyzerState {
  criticalError: string | null = null
  stages: TAnalyzerStages = initializedStagesState
  logMessages: TAnalyzerLogMessages = emptyLogMessagesState
}
