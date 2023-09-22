import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TMainTraceLogs } from '@evm-debuger/types'

import { createCallIdentifier } from '../../helpers/helpers'
import type { TRootState } from '../store'
import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TMainTraceLogsWithId } from './traceLogs.types'

const traceLogsInitialState: TMainTraceLogsWithId[] = []

export const traceLogsSlice = createSlice({
  reducers: {
    addTraceLogs: (state, action: PayloadAction<TMainTraceLogs[]>) => {
      return action.payload.map((traceLog) => {
        return { ...traceLog, id: createCallIdentifier(traceLog.stackTrace, traceLog.type) }
      })
    },
  },
  name: StoreKeys.TRACE_LOGS,
  initialState: traceLogsInitialState,
})

export const traceLogsReducer = traceLogsSlice.reducer
export const traceLogsActions = traceLogsSlice.actions
export type ITraceLogsActions = ActionsType<typeof traceLogsActions>

export const selectAllTraceLogs = (state: TRootState) => state.traceLogs
