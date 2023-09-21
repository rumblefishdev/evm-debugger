import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { TMainTraceLogsWithId } from '../../types'
import type { TRootState } from '../store'
import { StoreKeys } from '../store.keys'

const initialState: null | TMainTraceLogsWithId = null

export const activeBlockSlice = createSlice({
  reducers: {
    loadActiveBlock: (state, action: PayloadAction<TMainTraceLogsWithId>) => {
      return action.payload
    },
  },
  name: StoreKeys.ACTIVE_BLOCK,
  initialState,
})

export const activeBlockReducer = activeBlockSlice.reducer

export const selectActiveBlock = (state: TRootState) => state.activeBlock

export const { loadActiveBlock } = activeBlockSlice.actions
