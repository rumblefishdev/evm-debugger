import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { IRunAnalyzerPayload } from './analyzer.types'

export class AnalyzerState {
  public isLoading = false
  public messages: { timestamp: Date; message: string }[] = []
  public error?: string = null
}

export const analyzerSlice = createSlice({
  reducers: {
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
