import { createSelector } from '@reduxjs/toolkit'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { traceLogsSelectors } from '../traceLogs/traceLogs.selectors'
import { extendStack } from '../../helpers/helpers'
import { argStackExtractor } from '../../helpers/argStackExtractor'
import type { IExtendedStructLog } from '../../types'

import { structLogsAdapter } from './structlogs.slice'
import type { TStructlogWithListIndex } from './structlogs.types'

const selectStructlogsState = createSelector([selectReducer(StoreKeys.STRUCT_LOGS)], (state) => state)

const selectAll = createSelector([selectStructlogsState], (state) => structLogsAdapter.getSelectors().selectAll(state))

const selectAllOffCurrentBlock = createSelector(
  [selectAll, activeBlockSelectors.selectActiveBlock],
  (structLogs, { startIndex, returnIndex }) => {
    return structLogs.slice(startIndex, returnIndex + 1).filter((item) => item.depth === structLogs[startIndex].depth)
  },
)

const selectParsedStructLogs = createSelector([selectAllOffCurrentBlock, traceLogsSelectors.selectAll], (structLogs, traceLogs) =>
  structLogs
    .map((item) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item))
        return {
          ...argStackExtractor(item),
          stack: extendStack(item.stack),
          gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)?.gasCost,
        }

      return {
        ...argStackExtractor(item),
        stack: extendStack(item.stack),
      }
    })
    .reduce((accumulator, item, index) => {
      accumulator[item.index] = { ...item, listIndex: index }
      return accumulator
    }, {} as Record<number, TStructlogWithListIndex>),
)

const selectPcIndexedStructLogs = createSelector([selectParsedStructLogs], (_structlogs) => {
  return Object.values(_structlogs).reduce((accumulator, item) => {
    accumulator[item.pc] = item
    return accumulator
  }, {} as Record<number, TStructlogWithListIndex>)
})

export const structlogsSelectors = {
  selectPcIndexedStructLogs,
  selectParsedStructLogs,
  selectAllOffCurrentBlock,
  selectAll,
}
