import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TMainTraceLogs } from '@evm-debuger/types'

import type { TMainTraceLogsWithId } from '../../types'
import { createCallIdentifier } from '../../helpers/helpers'

const traceLogsAdapter = createEntityAdapter<TMainTraceLogsWithId>({
  selectId: (entity) => entity.id,
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
  name: 'traceLogs',
  initialState: traceLogsAdapter.getInitialState(),
})

export const traceLogsReducer = traceLogsSlice.reducer

export const { addTraceLogs } = traceLogsSlice.actions

export const traceLogsSelectors = traceLogsAdapter.getSelectors()
