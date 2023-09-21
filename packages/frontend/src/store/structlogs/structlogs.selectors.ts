import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { structlogsAdapter } from './structlogs.slice'

const selectStructlogsState = createSelector(selectReducer[StoreKeys.STRUCT_LOGS], (state) => state)

const selectAll = createSelector(selectStructlogsState, structlogsAdapter.getSelectors().selectAll)

const selectActiveStructLog = createSelector(selectStructlogsState, (state) => state.activeStructLog)

export const selectParsedStructLogs = createSelector(
  (state: TRootState) => state[StoreKeys.STRUCT_LOGS].structLogs,
  (state: TRootState) => selectAllTraceLogs(state),
  (state: TRootState) => state.activeBlock.startIndex,
  (state: TRootState) => state.activeBlock.returnIndex,
  getParsedStructLogs,
)

export const selectParsedStack = createSelector(
  (state: TRootState) => state[StoreKeys.STRUCT_LOGS].activeStructLog?.stack ?? [],
  getParsedStack,
)
export const selectParsedMemory = createSelector(
  (state: TRootState) => state[StoreKeys.STRUCT_LOGS].activeStructLog?.memory ?? [],
  getParsedMemory,
)
export const selectStructlogStorage = createSelector(
  [(state: TRootState) => state[StoreKeys.STRUCT_LOGS].activeStructLog?.storage],
  (state) => state ?? {},
)

export const structlogsSelectors = {
  selectAll,
  selectActiveStructLog,
}
