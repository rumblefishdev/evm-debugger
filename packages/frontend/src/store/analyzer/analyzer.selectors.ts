import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { analyzerStagesAdapter, analyzerLogMessagesAdapter } from './analyzer.state'
import { AnalyzerStagesStatus } from './analyzer.const'

const analyzerStagesSelectors = analyzerStagesAdapter.getSelectors()
const analyzerLogMessagesSelectors = analyzerLogMessagesAdapter.getSelectors()

const selectAnalyzerState = createSelector([selectReducer(StoreKeys.ANALYZER)], (state) => state)

const selectAllMessages = createSelector([selectAnalyzerState], (state) => analyzerLogMessagesSelectors.selectAll(state.logMessages))
const selectAllStages = createSelector([selectAnalyzerState], (state) => analyzerStagesSelectors.selectAll(state.stages))

const selectIsAnalyzerRunning = createSelector([selectAllStages], (stages) =>
  stages.some((stage) => stage.stageStatus === AnalyzerStagesStatus.IN_PROGRESS || stage.stageStatus === AnalyzerStagesStatus.NOT_STARTED),
)

const selectIsAnalyzerSuccessfullyFinished = createSelector([selectAllStages], (stages) => {
  return stages.every((stage) => stage.stageStatus === AnalyzerStagesStatus.SUCCESS)
})

const selectCriticalError = createSelector([selectAnalyzerState], (state) => state.criticalError)

const selectHasProcessingFailed = createSelector([selectAllStages, selectCriticalError], (stages, criticalError) => {
  return stages.some((stage) => stage.stageStatus === AnalyzerStagesStatus.FAILED) || criticalError
})

export const analyzerSelectors = {
  selectIsAnalyzerSuccessfullyFinished,
  selectIsAnalyzerRunning,
  selectHasProcessingFailed,
  selectCriticalError,
  selectAllStages,
  selectAllMessages,
}
