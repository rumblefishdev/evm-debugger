import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TContractStructlogsPerStartLine } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'

import { ActiveLineState } from './activeLine.state'
import type { TActiveLineState } from './activeLine.types'

const initialState = new ActiveLineState(null, {})

const activeLineSlice = createSlice({
  reducers: {
    setStructlogsPerActiveLine: (state, action: PayloadAction<Record<string, TContractStructlogsPerStartLine>>) => {
      const newState = { ...state }
      newState.structlogsPerActiveLine = action.payload
      return newState
    },
    setActiveLine: (state, action: PayloadAction<Pick<TActiveLineState, 'line'>>) => {
      const newState = { ...state }
      newState.line = action.payload.line
      return newState
    },
    clearActiveLine: (state) => {
      state.line = null
      return state
    },
  },
  name: StoreKeys.ACTIVE_LINE,
  initialState,
})

export const activeLineReducer = activeLineSlice.reducer
export const activeLineActions = activeLineSlice.actions
