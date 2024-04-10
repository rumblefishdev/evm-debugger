/* eslint-disable import/exports-last */
import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { structlogsSelectors } from '../structlogs/structlogs.selectors'

const selectActiveStructLogState = createSelector([selectReducer(StoreKeys.ACTIVE_STRUCT_LOG)], (state) => state)

const selectIndex = createSelector([selectActiveStructLogState], (state) => state || 0)

export const DEFAULT_STRING = '0000'

const selectActiveStructLog = createSelector(
  [structlogsSelectors.selectAllParsedStructLogs, selectIndex],
  (currentStructlogs, currentStructlog) => {
    return currentStructlogs[currentStructlog]
  },
)

export const selectParsedStack = createSelector([selectActiveStructLog], (activeStructlog) => {
  if (!activeStructlog) return []
  return activeStructlog.stack
    .map((stackItem, index) => {
      const hexValue = (activeStructlog.stack.length - 1 - index).toString()
      const paddedHexValue = DEFAULT_STRING.slice(0, Math.max(0, DEFAULT_STRING.length - hexValue.length)) + hexValue

      return { value: stackItem, index: paddedHexValue }
    })
    .reverse()
})

export const selectParsedMemory = createSelector(
  [selectActiveStructLog],
  (activeStructlog) =>
    activeStructlog?.memory.map((memoryItem, index) => {
      const hexValue = (index * 32).toString(16)
      const paddedHexValue = hexValue.padStart(DEFAULT_STRING.length, '0')

      return { value: memoryItem, index: paddedHexValue }
    }) ?? [],
)
export const selectStructlogStorage = createSelector([selectActiveStructLog], (state) => state?.storage ?? {})

export const activeStructLogSelectors = {
  selectStructlogStorage,
  selectParsedStack,
  selectParsedMemory,
  selectIndex,
  selectActiveStructLog,
}
