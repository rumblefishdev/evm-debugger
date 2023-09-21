import { createSelector } from '@reduxjs/toolkit'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { tracleLogsSelectors } from '../traceLogs/tractLogs.selectors'
import { extendStack } from '../../helpers/helpers'
import { argStackExtractor } from '../../helpers/argStackExtractor'

import { structlogsAdapter } from './structlogs.slice'

const selectStructlogsState = createSelector([selectReducer(StoreKeys.STRUCT_LOGS)], (state) => state)

const selectAll = createSelector(selectStructlogsState, structlogsAdapter.getSelectors().selectAll)

const selectActiveStructLog = createSelector(selectStructlogsState, (state) => state.activeStructLog)

export const selectParsedStructLogs = createSelector(
  [selectAll, tracleLogsSelectors.selectAll, activeBlockSelectors.selectParsedActiveBlock],
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

export const structlogsSelectors = {
  selectStructlogStorage,
  selectParsedStructLogs,
  selectParsedStack,
  selectParsedMemory,
  selectAll,
  selectActiveStructLog,
}
