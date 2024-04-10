import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { traceLogsSelectors } from '../traceLogs/traceLogs.selectors'
import type { IExtendedStructLog } from '../../types'

import { structLogsAdapter } from './structlogs.slice'
import { parseStructlogs } from './structlogs.utils'

const selectStructlogsState = createSelector([selectReducer(StoreKeys.STRUCT_LOGS)], (state) => state)

const selectAll = createSelector([selectStructlogsState], (state) => structLogsAdapter.getSelectors().selectAll(state))

const selectAllOffCurrentBlock = createSelector(
  [selectAll, activeBlockSelectors.selectActiveBlock],
  (structLogs, { startIndex, returnIndex }) => {
    return structLogs.slice(startIndex, returnIndex + 1).filter((item) => item.depth === structLogs[startIndex].depth)
  },
)

const selectAllParsedStructLogs = createSelector([selectAll, traceLogsSelectors.selectAll], (structLogs, traceLogs) =>
  parseStructlogs(structLogs, traceLogs).reduce((accumulator, item) => {
    accumulator[item.index] = item
    return accumulator
  }, {} as Record<number, IExtendedStructLog>),
)

export const structlogsSelectors = {
  selectAllParsedStructLogs,
  selectAllOffCurrentBlock,
  selectAll,
}
