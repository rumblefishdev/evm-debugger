import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { TMainTraceLogsWithId } from '../../types'
import type { TRootState } from '../store'

export class ActiveBlockState {
  activeBlock?: TMainTraceLogsWithId = null
}

export const initialState: TMainTraceLogsWithId | null = null

export const activeBlockSlice = createSlice({
  reducers: {
    loadActiveBlock: (state, action: PayloadAction<TMainTraceLogsWithId>) => {
      state = action.payload
    },
  },
  name: 'activeBlock',
  initialState,
})

export const activeBlockReducer = activeBlockSlice.reducer

export const selectActiveBlock = (state: TRootState) => state.activeBlock

export const { loadActiveBlock } = activeBlockSlice.actions
