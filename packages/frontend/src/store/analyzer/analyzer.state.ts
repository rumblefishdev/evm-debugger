import { createEntityAdapter } from '@reduxjs/toolkit'

import type { IAnalyzerState, TAnalyzerLogMessages, TAnalyzerStages, TLogMessageRecord, TStageRecord } from './analyzer.types'
import { AnalyzerStages, AnalyzerStagesStatus } from './analyzer.const'

export const analyzerStagesAdapter = createEntityAdapter<TStageRecord>({ selectId: (stage) => stage.stageName })
export const analyzerLogMessagesAdapter = createEntityAdapter<TLogMessageRecord>({ selectId: (message) => message.identifier })

export const INITIAL_STAGES: TStageRecord[] = [
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.FETCHING_STRUCTLOGS },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.FETCHING_BYTECODES },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.FETCHING_SOURCE_CODES },
  { stageStatus: AnalyzerStagesStatus.NOT_STARTED, stageName: AnalyzerStages.RUNNING_ANALYZER },
]

export class AnalyzerState implements IAnalyzerState {
  criticalError: string | null = null
  stages: TAnalyzerStages = analyzerStagesAdapter.getInitialState()
  logMessages: TAnalyzerLogMessages = analyzerLogMessagesAdapter.getInitialState()
}
