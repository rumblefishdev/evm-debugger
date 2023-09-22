import type { IStructLog } from '@evm-debuger/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import type { IExtendedStructLog } from '../../types'
import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TStructlogsSlice } from './structlogs.types'

export const initialStructlogsState: TStructlogsSlice = {
  structLogs: [],
  activeStructLog: null,
}

export const structLogsSlice = createSlice({
  reducers: {
    updateStackSelectionStatus: (state, action: PayloadAction<string>) => {
      const activeStructlog = state.activeStructLog

      if (activeStructlog) {
        const index = [...activeStructlog.stack].reverse().findIndex((item) => item.value === action.payload)
        const count = activeStructlog.stack.length - 1
        if (index !== -1) state.activeStructLog.stack[count - index].isSelected = !activeStructlog.stack[count - index].isSelected
      }
    },
    loadStructLogs: (state, action: PayloadAction<IStructLog[]>) => {
      state.structLogs = action.payload
    },
    loadPreviousStructlog: (state, action: PayloadAction<IExtendedStructLog[]>) => {
      if (state.activeStructLog.index > 0) state.activeStructLog = action.payload[state.activeStructLog.index - 1]
    },

    loadNextStructlog: (state, action: PayloadAction<IExtendedStructLog[]>) => {
      const totalCount = state.structLogs.length
      if (state.activeStructLog.index < totalCount - 1) state.activeStructLog = action.payload[state.activeStructLog.index + 1]
    },
    loadActiveStructLog: (state, action: PayloadAction<IExtendedStructLog | null>) => {
      state.activeStructLog = action.payload
    },
  },
  name: StoreKeys.STRUCT_LOGS,
  initialState: initialStructlogsState,
})

export const structLogsReducer = structLogsSlice.reducer
export const structLogsActions = structLogsSlice.actions
export type IStructLogsActions = ActionsType<typeof structLogsActions>
