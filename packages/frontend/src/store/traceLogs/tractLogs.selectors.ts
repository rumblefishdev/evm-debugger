import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { traceLogsAdapter } from './traceLogs.slice'

const selectTraceLogsState = createSelector([selectReducer(StoreKeys.TRACE_LOGS)], (state) => state)

const selectAll = createSelector(selectTraceLogsState, traceLogsAdapter.getSelectors().selectAll)

export const tracleLogsSelectors = { selectAll }
