// TODO: remove ts-ignore and fix typescript errors
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TTraceLog } from '@evm-debuger/types'

import { createCallIdentifier } from '../../helpers/helpers'
import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TMainTraceLogsWithId } from './traceLogs.types'

export const traceLogsAdapter = createEntityAdapter<TMainTraceLogsWithId>({
  selectId: (entity: TMainTraceLogsWithId) => entity.id,
})

export const traceLogsSlice = createSlice({
  reducers: {
    clearTraceLogs: (state) => traceLogsAdapter.removeAll(state),
    addTraceLogs: (state, action: PayloadAction<TTraceLog[]>) => {
      const traceLogs = action.payload.map<TMainTraceLogsWithId>((traceLog) => ({
        ...traceLog,
        id: createCallIdentifier(traceLog.stackTrace, traceLog.op),
      }))
      traceLogsAdapter.addMany(state, traceLogs)
    },
  },
  name: StoreKeys.TRACE_LOGS,
  initialState: traceLogsAdapter.getInitialState(),
})

export const traceLogsActions = traceLogsSlice.actions
export const traceLogsReducer = traceLogsSlice.reducer

export type ITraceLogsActions = ActionsType<typeof traceLogsActions>
