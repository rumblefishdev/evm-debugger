import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { traceLogsAdapter } from './traceLogs.slice'

const selectTraceLogsState = createSelector([selectReducer(StoreKeys.TRACE_LOGS)], (state) => state)

const selectAll = createSelector([selectTraceLogsState], (state) => traceLogsAdapter.getSelectors().selectAll(state))

const selectEntities = createSelector([selectTraceLogsState], (state) => traceLogsAdapter.getSelectors().selectEntities(state))

export const traceLogsSelectors = { selectEntities, selectAll }
