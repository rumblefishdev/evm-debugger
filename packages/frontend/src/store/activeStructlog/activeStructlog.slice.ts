import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import type { IExtendedStructLog } from '../../types'
import type { TRootState } from '../store'

const initialState: IExtendedStructLog | null = null

export const activeStructlogSlice = createSlice({
  reducers: {
    updateStackSelectionStatus: (state, action: PayloadAction<string>) => {
      if (state) {
        const index = [...state.stack].reverse().findIndex((item) => item.value === action.payload)
        const count = state.stack.length - 1
        if (index !== -1) state.stack[count - index].isSelected = !state.stack[count - index].isSelected
      }
    },
    loadActiveStructlog: (state, action: PayloadAction<IExtendedStructLog | null>) => {
      return action.payload
    },
  },
  name: 'activeStructlog',
  initialState,
})

export const activeStructlogReducer = activeStructlogSlice.reducer

export const isStructLogActive = (state: IExtendedStructLog | null, index: number): boolean => {
  return state?.index === index
}

export const selectStructlogStack = createSelector([(state: TRootState) => state.activeStructlog?.stack], (state) => state ?? [])
export const selectStructlogMemory = createSelector([(state: TRootState) => state.activeStructlog?.memory], (state) => state ?? [])
export const selectStructlogStorage = createSelector([(state: TRootState) => state.activeStructlog?.storage], (state) => state ?? {})

export const { loadActiveStructlog, updateStackSelectionStatus } = activeStructlogSlice.actions
