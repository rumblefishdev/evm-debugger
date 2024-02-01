import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TStructlogsPerStartLine } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'

import { ActiveLineState } from './activeLine.state'
import type { TActiveLineState } from './activeLine.types'

const initialState = new ActiveLineState(null, null, {})

const activeLineSlice = createSlice({
  reducers: {
    setStructlogsPerActiveLine: (state, action: PayloadAction<Record<string, TStructlogsPerStartLine>>) => {
      const newState = { ...state }
      newState.structlogsPerActiveLine = action.payload
      return newState
    },
    setActiveLine: (state, action: PayloadAction<Pick<TActiveLineState, 'fileId' | 'line'>>) => {
      const newState = { ...state }
      newState.line = action.payload.line
      newState.fileId = action.payload.fileId
      return newState
    },
    clearActiveLine: (state) => {
      state.line = null
      state.fileId = null
      return state
    },
  },
  name: StoreKeys.ACTIVE_LINE,
  initialState,
})

export const activeLineReducer = activeLineSlice.reducer
export const activeLineActions = activeLineSlice.actions
