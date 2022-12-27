import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { TTraceLog } from '../../types'
import type { TRootState } from '../store'

export class ActiveBlockState {
  activeBlock?: TTraceLog = null
}

export const initialState = { ...new ActiveBlockState() }

export const activeBlockSlice = createSlice({
  reducers: {
    loadActiveBlock: (state, action: PayloadAction<TTraceLog>) => {
      state.activeBlock = action.payload
    },
  },
  name: 'activeBlock',
  initialState,
})

export const activeBlockReducer = activeBlockSlice.reducer

export const selectActiveBlock = (state: TRootState) => state.activeBlock

export const { loadActiveBlock } = activeBlockSlice.actions
