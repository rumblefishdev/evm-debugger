import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { IRunAnalyzerPayload } from './analyzer.types'

type TAnalyzeStageName =
  | 'Fetching transaction info'
  | 'Fetching structlogs'
  | 'Run analyzer'
  | 'Trying to fetch missing data'
  | 'ReRun analyzer'

type TAnalyzeStage = {
  stageName: TAnalyzeStageName
  isFinished: boolean
}

const ANALYZE_STAGES: TAnalyzeStage[] = [
  { stageName: 'Fetching transaction info', isFinished: false },
  { stageName: 'Fetching structlogs', isFinished: false },
  { stageName: 'Run analyzer', isFinished: false },
  { stageName: 'Trying to fetch missing data', isFinished: false },
  { stageName: 'ReRun analyzer', isFinished: false },
]

export class AnalyzerState {
  public isLoading = false
  public messages: { timestamp: Date; message: string }[] = []
  public error: string | null = null
  public stages: TAnalyzeStage[] = ANALYZE_STAGES
}

export const analyzerSlice = createSlice({
  reducers: {
    updateStage: (state, action: PayloadAction<TAnalyzeStageName>) => {
      const stageIndex = state.stages.findIndex(
        (stage) => stage.stageName === action.payload,
      )
      if (stageIndex === -1) return state

      state.stages[stageIndex].isFinished = true
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    reset: (state) => {
      state.messages = []
      state.isLoading = false
    },
    logMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        timestamp: new Date(),
        message: action.payload,
      })
    },
  },
  name: 'analyzer',
  initialState: { ...new AnalyzerState() },
})

export const analyzerActions = {
  runAnalyzer: createAction<IRunAnalyzerPayload>('analyzer/runAnalyzer'),
  ...analyzerSlice.actions,
}

export const analyzerReducer = analyzerSlice.reducer
