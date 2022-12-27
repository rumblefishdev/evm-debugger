import { checkIfOfCallType } from '@evm-debuger/analyzer'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

import type { TMainTraceLogsWithId } from '../../types'
import type { TRootState } from '../store'

const initialState: TMainTraceLogsWithId | null = null

export const activeBlockSlice = createSlice({
  reducers: {
    loadActiveBlock: (state, action: PayloadAction<TMainTraceLogsWithId>) => {
      return action.payload
    },
  },
  name: 'activeBlock',
  initialState,
})

export const activeBlockReducer = activeBlockSlice.reducer

export const selectActiveBlock = (state: TRootState) => state.activeBlock

export const { loadActiveBlock } = activeBlockSlice.actions
