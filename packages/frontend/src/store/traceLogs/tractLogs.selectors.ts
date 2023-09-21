import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { traceLogsAdapter } from './traceLogs.slice'
import type { TMainTraceLogsWithId } from './traceLogs.types'
import { parseNestedArrayRecursive } from './traceLogs.utils'

const selectTraceLogsState = createSelector(selectReducer[StoreKeys.TRACE_LOGS], (state) => state)

const selectAll = createSelector(selectTraceLogsState, traceLogsAdapter.getSelectors().selectAll)

export const selectMappedTraceLogs = createSelector(
  [selectAll, (_: TMainTraceLogsWithId[], width: number) => width, (_: TMainTraceLogsWithId[], width: number, height: number) => height],
  (traceLogs, width, height) => {
    const dimensions = { y: 0, x: 0, width, height }

    const rootItem = {
      nestedItems: [],
      item: traceLogs[0],
      dimensions,
    }

    return {
      ...rootItem,
      nestedItems: parseNestedArrayRecursive(rootItem, traceLogs, height, width),
    }
  },
)

export const tracleLogsSelectors = { selectMappedTraceLogs, selectAll }
