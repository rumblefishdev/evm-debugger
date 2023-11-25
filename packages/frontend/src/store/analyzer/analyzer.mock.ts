import { AnalyzerStagesStatus } from './analyzer.const'
import { AnalyzerState, INITIAL_STAGES, analyzerLogMessagesAdapter, analyzerStagesAdapter } from './analyzer.state'
import { createMockedLogMessages } from './analyzer.utils'

export const mockedAllStagesPassed = INITIAL_STAGES.map((stage) => ({ ...stage, stageStatus: AnalyzerStagesStatus.SUCCESS }))

export const createDirtyAnalyerState = (): AnalyzerState => {
  const initialState = new AnalyzerState()
  return {
    ...initialState,
    stages: analyzerStagesAdapter.setAll(initialState.stages, [...mockedAllStagesPassed]),
    logMessages: analyzerLogMessagesAdapter.setAll(initialState.logMessages, [...createMockedLogMessages(10)]),
  }
}
