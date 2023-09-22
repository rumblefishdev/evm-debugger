import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectTraceLogsState = createSelector([selectReducer(StoreKeys.TRACE_LOGS)], (state) => state)

const selectAll = createSelector(selectTraceLogsState, (state) => state)

export const tracleLogsSelectors = { selectAll }
