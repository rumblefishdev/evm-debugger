import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { selectParsedStructLogs, structlogsSelectors } from '../structlogs/structlogs.selectors'

const selectActiveStructLogState = createSelector([selectReducer(StoreKeys.ACTIVE_STRUCT_LOG)], (state) => state)

const selectIndex = createSelector([selectActiveStructLogState], (state) => state)

const selectNextIndex = createSelector([structlogsSelectors.selectAll, selectIndex], (structLogs, activeIndex) => {
  return structLogs[activeIndex + 1] ? activeIndex + 1 : activeIndex
})

const selectPreviousIndex = createSelector([structlogsSelectors.selectAll, selectIndex], (structLogs, activeIndex) => {
  return structLogs[activeIndex - 1] ? activeIndex - 1 : activeIndex
})

const selectActiveStructLog = createSelector(
  [structlogsSelectors.selectParsedStructLogs, selectActiveStructLogState],
  (structLogs, currentStructlogIndex) => structLogs[currentStructlogIndex],
)

export const selectParsedStack = createSelector(
  [selectActiveStructLog],
  (activeStructlog) =>
    activeStructlog?.stack
      .map((stackItem, index) => {
        const defaultString = '0000'
        const hexValue = (activeStructlog.stack.length - 1 - index).toString()
        const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue

        return { value: stackItem, index: paddedHexValue }
      })
      .reverse() ?? [],
)

export const selectParsedMemory = createSelector(
  [selectActiveStructLog],
  (activeStructlog) =>
    activeStructlog?.memory.map((memoryItem, index) => {
      const defaultString = '0000'
      const hexValue = (index * 32).toString(16)
      const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue
      const splitMemoryItem = [...memoryItem.match(/.{1,2}/g)]

      return { value: splitMemoryItem, index: paddedHexValue }
    }) ?? [],
)
export const selectStructlogStorage = createSelector([selectActiveStructLog], (state) => state?.storage ?? {})

export const activeStructLogSelectors = {
  selectStructlogStorage,
  selectPreviousIndex,
  selectParsedStack,
  selectParsedMemory,
  selectNextIndex,
  selectIndex,
  selectActiveStructLog,
}
