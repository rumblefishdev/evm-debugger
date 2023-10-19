import { createSelector } from '@reduxjs/toolkit'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { traceLogsSelectors } from '../traceLogs/traceLogs.selectors'
import { extendStack } from '../../helpers/helpers'
import { argStackExtractor } from '../../helpers/argStackExtractor'
import { activeStructLogSelectors } from '../activeStructLog/activeStructLog.selectors'

const selectStructlogsState = createSelector([selectReducer(StoreKeys.STRUCT_LOGS)], (state) => state)

const selectAll = createSelector(selectStructlogsState, (state) => state)

export const selectParsedStructLogs = createSelector(
  [selectAll, traceLogsSelectors.selectAll, activeBlockSelectors.selectParsedActiveBlock],
  (structLogs, traceLogs, { defaultData: { startIndex, returnIndex } }) =>
    structLogs
      .slice(startIndex, returnIndex + 1)
      .filter((item) => item.depth === structLogs[startIndex].depth)
      .map((item, index) => {
        if (checkIfOfCallType(item) || checkIfOfCreateType(item))
          return {
            ...argStackExtractor(item),
            stack: extendStack(item.stack),
            index,
            gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)?.gasCost,
          }

        return {
          ...argStackExtractor(item),
          stack: extendStack(item.stack),
          index,
        }
      }),
)

export const selectParsedStack = createSelector(
  [activeStructLogSelectors.selectActiveStructLog],
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
  [activeStructLogSelectors.selectActiveStructLog],
  (activeStructlog) =>
    activeStructlog?.memory.map((memoryItem, index) => {
      const defaultString = '0000'
      const hexValue = (index * 32).toString(16)
      const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue
      const splitMemoryItem = [...memoryItem.match(/.{1,2}/g)]

      return { value: splitMemoryItem, index: paddedHexValue }
    }) ?? [],
)
export const selectStructlogStorage = createSelector([activeStructLogSelectors.selectActiveStructLog], (state) => state?.storage ?? {})

export const structlogsSelectors = {
  selectStructlogStorage,
  selectParsedStructLogs,
  selectParsedStack,
  selectParsedMemory,
  selectAll,
}
