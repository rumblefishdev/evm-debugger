import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TMainTraceLogs } from '@evm-debuger/types'

import { createCallIdentifier } from '../../helpers/helpers'
import type { TRootState } from '../store'
import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TMainTraceLogsWithId } from './traceLogs.types'

export const traceLogsAdapter = createEntityAdapter<TMainTraceLogsWithId>({
  sortComparer: (a, b) => a.index - b.index,
  selectId: (traceLog) => traceLog.id,
})

export const traceLogsSlice = createSlice({
  reducers: {
    addTraceLogs: (state, action: PayloadAction<TMainTraceLogs[]>) => {
      traceLogsAdapter.addMany(
        state,
        action.payload.map((traceLog) => ({
          ...traceLog,
          id: createCallIdentifier(traceLog.stackTrace, traceLog.type),
        })),
      )
    },
  },
  name: StoreKeys.TRACE_LOGS,
  initialState: traceLogsAdapter.getInitialState(),
})

export const traceLogsReducer = traceLogsSlice.reducer
export const traceLogsActions = traceLogsSlice.actions
export type ITraceLogsActions = ActionsType<typeof traceLogsActions>

export const selectAllTraceLogs = (state: TRootState) => state.traceLogs
