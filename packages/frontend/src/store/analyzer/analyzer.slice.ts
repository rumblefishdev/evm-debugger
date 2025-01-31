import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import { AnalyzerState, analyzerLogMessagesAdapter, analyzerStagesAdapter } from './analyzer.state'
import type { TAddLogMessagePayload, TProcessTransactionPayload, TStageRecord } from './analyzer.types'

export const initialAnalyzerState: AnalyzerState = { ...new AnalyzerState() }

export const analyzerSlice = createSlice({
  reducers: {
    updateStage: (state, action: PayloadAction<TStageRecord>) => {
      analyzerStagesAdapter.updateOne(state.stages, { id: action.payload.stageName, changes: action.payload })
    },
    setCriticalError: (state, action: PayloadAction<string>) => {
      state.criticalError = action.payload
    },

    runAnalyzer: () => {},
    runAgainSpecificStages: (state, action: PayloadAction<TStageRecord[]>) => {
      const stagesToUpdate = action.payload.map((stage) => ({ id: stage.stageName, changes: stage }))

      analyzerStagesAdapter.updateMany(state.stages, stagesToUpdate)
    },
    resetAnalyzer: () => {},
    processTransaction: (_, __: PayloadAction<TProcessTransactionPayload>) => {},
    initializeTransactionProcessing: (_, __: PayloadAction<TProcessTransactionPayload>) => {},

    gatherContractsInformations: () => {},
    clearAnalyzerInformation: () => {
      return { ...new AnalyzerState() }
    },
    addStage: (state, action: PayloadAction<TStageRecord>) => {
      analyzerStagesAdapter.addOne(state.stages, action.payload)
    },

    addLogMessage: (state, { payload }: PayloadAction<TAddLogMessagePayload>) => {
      analyzerLogMessagesAdapter.addOne(state.logMessages, payload)
    },
  },
  name: StoreKeys.ANALYZER,
  initialState: initialAnalyzerState,
})

export const analyzerReducer = analyzerSlice.reducer
export const analyzerActions = analyzerSlice.actions

export type TAnalyzerActions = ActionsType<typeof analyzerActions>
