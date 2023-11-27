import type { EntityState } from '@reduxjs/toolkit'
import type { ChainId } from '@evm-debuger/types'

import type { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from './analyzer.const'

export type TStageRecord = {
  stageName: AnalyzerStages
  stageStatus: AnalyzerStagesStatus
}

export type TLogMessageRecord = {
  identifier: string
  timestamp: number
  message: string
  status: LogMessageStatus
}

export type TAnalyzerStages = EntityState<TStageRecord>
export type TAnalyzerLogMessages = EntityState<TLogMessageRecord>

export interface IAnalyzerState {
  criticalError: string | null
  stages: TAnalyzerStages
  logMessages: TAnalyzerLogMessages
}

export type TAddLogMessagePayload = TLogMessageRecord

export type TProcessTransactionPayload = {
  chainId: ChainId
  transactionHash: string
}
