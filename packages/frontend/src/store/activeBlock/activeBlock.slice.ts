import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { TParsedExtendedTraceLog } from '../../types'
import type { TRootState } from '../store'

const initialState = {} as TParsedExtendedTraceLog

export const activeBlockSlice = createSlice({
  reducers: {
    loadActiveBlock: (state, action: PayloadAction<TParsedExtendedTraceLog>) => {
      console.log('loadActiveBlock', action.payload)
      return action.payload
    },
  },
  name: 'activeBlock',
  initialState,
})

export const activeBlockReducer = activeBlockSlice.reducer

export const selectActiveBlock = (state: TRootState) => state.activeBlock

export const { loadActiveBlock } = activeBlockSlice.actions
