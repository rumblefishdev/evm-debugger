import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'
import type { IStructLog, TMainTraceLogs } from '@evm-debuger/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { extendStack } from '../../helpers/helpers'
import type { IExtendedStructLog, TExtendedStack } from '../../types'
import type { TRootState } from '../store'
import { selectAllTraceLogs } from '../traceLogs/traceLogs.slice'
import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TStructlogsSlice } from './structlogs.types'

export const structlogsAdapter = createEntityAdapter<IStructLog>({
  sortComparer: (a, b) => a.pc - b.pc,
  selectId: (entity) => entity.pc,
})

export const initialStructlogsState: TStructlogsSlice = {
  ...structlogsAdapter.getInitialState(),
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
    loadStructLogs: structlogsAdapter.setAll,
    loadPreviousStructlog: (state, action: PayloadAction<IExtendedStructLog[]>) => {
      if (state.activeStructLog.index > 0) state.activeStructLog = action.payload[state.activeStructLog.index - 1]
    },

    loadNextStructlog: (state, action: PayloadAction<IExtendedStructLog[]>) => {
      const totalCount = structlogsAdapter.getSelectors().selectTotal(state)
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
export type IFundraiseActions = ActionsType<typeof structLogsActions>

export const { loadStructLogs, updateStackSelectionStatus, loadPreviousStructlog, loadNextStructlog, loadActiveStructLog } =
  structLogsSlice.actions
