import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { v4 as createUUID } from 'uuid'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import { AnalyzerState, INITIAL_STAGES, analyzerLogMessagesAdapter, analyzerStagesAdapter } from './analyzer.state'
import type { TAddLogMessagePayload, TLogMessageRecord, TProcessTransactionPayload, TStageRecord } from './analyzer.types'

export const initialAnalyzerState = { ...new AnalyzerState() }

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
    processTransaction: (_, __: PayloadAction<TProcessTransactionPayload>) => {},
    initializeStages: (state, _) => {
      analyzerStagesAdapter.setAll(state.stages, INITIAL_STAGES)
    },

    gatherContractsInformations: () => {},

    clearAnalyzerInformation: (state) => {
      state.logMessages = analyzerLogMessagesAdapter.getInitialState()
      state.stages = analyzerStagesAdapter.getInitialState()
      state.criticalError = null
    },

    analyzerFinished: () => {},

    addStage: (state, action: PayloadAction<TStageRecord>) => {
      analyzerStagesAdapter.addOne(state.stages, action.payload)
    },

    addLogMessage: (state, { payload }: PayloadAction<TAddLogMessagePayload>) => {
      const timestamp = Date.now()
      const identifier = createUUID()
      const newLogMessageRecord: TLogMessageRecord = { ...payload, timestamp, identifier }

      analyzerLogMessagesAdapter.addOne(state.logMessages, newLogMessageRecord)
    },
  },
  name: StoreKeys.ANALYZER,
  initialState: initialAnalyzerState,
})

export const analyzerReducer = analyzerSlice.reducer
export const analyzerActions = analyzerSlice.actions

export type TAnalyzerActions = ActionsType<typeof analyzerActions>
