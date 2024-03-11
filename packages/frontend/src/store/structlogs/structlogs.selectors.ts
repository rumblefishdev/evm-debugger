import { createSelector } from '@reduxjs/toolkit'
import { BaseOpcodesHex, getOpcodeAsHex } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { traceLogsSelectors } from '../traceLogs/traceLogs.selectors'
import { instructionsSelectors } from '../instructions/instructions.selectors'

import { structLogsAdapter } from './structlogs.slice'
import type { TStructlogWithListIndex } from './structlogs.types'
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
  parseStructlogs(structLogs, traceLogs).reduce((accumulator, item, index) => {
    accumulator[item.index] = { ...item, listIndex: index }
    return accumulator
  }, {} as Record<number, TStructlogWithListIndex>),
)

const selectParsedStructLogs = createSelector([selectAllOffCurrentBlock, traceLogsSelectors.selectAll], (structLogs, traceLogs) =>
  parseStructlogs(structLogs, traceLogs).reduce((accumulator, item, index) => {
    accumulator[item.index] = { ...item, listIndex: index }
    return accumulator
  }, {} as Record<number, TStructlogWithListIndex>),
)

export const structlogsSelectors = {
  selectParsedStructLogs,
  selectAllParsedStructLogs,
  selectAllOffCurrentBlock,
  selectAll,
}
