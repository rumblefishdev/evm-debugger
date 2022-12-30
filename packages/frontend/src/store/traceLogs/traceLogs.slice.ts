import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TMainTraceLogs } from '@evm-debuger/types'

import type { TMainTraceLogsWithId } from '../../types'
import { createCallIdentifier } from '../../helpers/helpers'
import type { TRootState } from '../store'

const initialState: TMainTraceLogsWithId[] = []

export const traceLogsSlice = createSlice({
  reducers: {
    addTraceLogs: (state, action: PayloadAction<TMainTraceLogs[]>) => {
      const traceLogsWithId: TMainTraceLogsWithId[] = action.payload.map(
        (traceLog) => ({
          ...traceLog,
          id: createCallIdentifier(traceLog.stackTrace, traceLog.type),
        }),
      )

      return traceLogsWithId
    },
  },
  name: 'traceLogs',
  initialState,
})

export const traceLogsReducer = traceLogsSlice.reducer

export const { addTraceLogs } = traceLogsSlice.actions

export const selectAllTraceLogs = (state: TRootState) => state.traceLogs
