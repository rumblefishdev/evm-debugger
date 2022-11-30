import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { TParsedExtendedTraceLog } from '../../types'

const initialState = {} as TParsedExtendedTraceLog

export const activeBlockSlice = createSlice({
  reducers: {
    loadActiveBlock: (state, action: PayloadAction<TParsedExtendedTraceLog>) => {
      return action.payload
    },
  },
  name: 'activeBlock',
  initialState,
})

export const activeBlockReducer = activeBlockSlice.reducer

export const { loadActiveBlock } = activeBlockSlice.actions
