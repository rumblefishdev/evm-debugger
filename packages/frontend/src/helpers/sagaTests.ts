import type { PayloadAction } from '@reduxjs/toolkit'

import type { TLogMessageRecord } from '../store/analyzer/analyzer.types'
import type { AnalyzerStages, AnalyzerStagesStatus } from '../store/analyzer/analyzer.const'
import type { AnalyzerState } from '../store/analyzer/analyzer.state'

export const createLogMessageActionForTests = <T extends string>(action: PayloadAction<TLogMessageRecord, T>) => {
  const { timestamp, identifier, ...addLogExpectedActionPayload } = action.payload
  return {
    type: action.type,
    payload: addLogExpectedActionPayload,
  }
}

export const updateAnalyzerStageStatus = (
  stage: AnalyzerStages,
  status: AnalyzerStagesStatus,
  state: AnalyzerState,
): AnalyzerState['stages'] => {
  return {
    ids: [...state.stages.ids],
    entities: {
      ...state.stages.entities,
      [stage]: { stageStatus: status, stageName: stage },
    },
  }
}

export const mockLogsInAnalyer = (): AnalyzerState['logMessages'] => {
  return {
    ids: expect.any(Array),
    entities: expect.any(Object),
  }
}

export const testLogMessages = (state: AnalyzerState, logMessages: TLogMessageRecord[]) => {
  expect(state.logMessages.ids).toEqual(logMessages.map(() => expect.any(String)))
  expect(Object.values(state.logMessages.entities)).toEqual(
    logMessages.map((logMessage) => ({
      ...logMessage,
      timestamp: expect.any(Number),
      identifier: expect.any(String),
    })),
  )
}
