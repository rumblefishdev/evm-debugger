import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'
import type { IStructLog, TMainTraceLogs } from '@evm-debuger/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import { argStackExtractor } from '../../helpers/argStackExtractor'
import { extendStack } from '../../helpers/helpers'
import type { IExtendedStructLog, TExtendedStack } from '../../types'
import type { TRootState } from '../store'
import { selectAllTraceLogs } from '../traceLogs/traceLogs.slice'

const initialState: {
  structLogs: IStructLog[]
  activeStructLog: IExtendedStructLog | null
} = {
  structLogs: [],
  activeStructLog: null,
}

export const structLogsSlice = createSlice({
  reducers: {
    updateStackSelectionStatus: (state, action: PayloadAction<string>) => {
      const activeStructlog = state.activeStructLog

      if (activeStructlog) {
        const index = [...activeStructlog.stack]
          .reverse()
          .findIndex((item) => item.value === action.payload)
        const count = activeStructlog.stack.length - 1
        if (index !== -1)
          state.activeStructLog.stack[count - index].isSelected =
            !activeStructlog.stack[count - index].isSelected
      }
    },
    loadStructLogs: (state, action: PayloadAction<IStructLog[]>) => {
      state.structLogs = action.payload
    },

    loadPreviousStructlog: (
      state,
      action: PayloadAction<IExtendedStructLog[]>,
    ) => {
      if (state.activeStructLog.index > 0)
        state.activeStructLog = action.payload[state.activeStructLog.index - 1]
    },

    loadNextStructlog: (state, action: PayloadAction<IExtendedStructLog[]>) => {
      if (state.activeStructLog.index < state.structLogs.length - 1)
        state.activeStructLog = action.payload[state.activeStructLog.index + 1]
    },
    loadActiveStructLog: (
      state,
      action: PayloadAction<IExtendedStructLog | null>,
    ) => {
      state.activeStructLog = action.payload
    },
  },
  name: 'structLogs',
  initialState,
})

export const structLogsReducer = structLogsSlice.reducer

export const isStructLogActive = (
  state: TRootState,
  index: number,
): boolean => {
  return state.structLogs.activeStructLog?.index === index
}

export const getParsedStructLogs = (
  structLogs: IStructLog[],
  traceLogs: TMainTraceLogs[],
  startIndex: number,
  returnIndex: number,
): IExtendedStructLog[] => {
  return structLogs
    .slice(startIndex, returnIndex)
    .filter((item) => item.depth === structLogs[startIndex].depth)
    .map((item, index) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item))
        return {
          ...argStackExtractor(item),
          stack: extendStack(item.stack),
          index,
          gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)
            ?.gasCost,
        }

      return {
        ...argStackExtractor(item),
        stack: extendStack(item.stack),
        index,
      }
    })
}

export const getParsedStack = (stack: TExtendedStack) => {
  return stack
    .map((stackItem, index) => {
      const defaultString = '0000'
      const hexValue = (stack.length - 1 - index).toString()
      const paddedHexValue =
        defaultString.slice(
          0,
          Math.max(0, defaultString.length - hexValue.length),
        ) + hexValue

      return { value: stackItem, index: paddedHexValue }
    })
    .reverse()
}

export const getParsedMemory = (memory: string[]) => {
  return memory.map((memoryItem, index) => {
    const defaultString = '0000'
    const hexValue = (index * 32).toString(16)
    const paddedHexValue =
      defaultString.slice(
        0,
        Math.max(0, defaultString.length - hexValue.length),
      ) + hexValue
    const splitMemoryItem = [...memoryItem.match(/.{1,2}/g)]

    return { value: splitMemoryItem, index: paddedHexValue }
  })
}

export const selectParsedStructLogs = createSelector(
  (state: TRootState) => state.structLogs.structLogs,
  (state: TRootState) => selectAllTraceLogs(state),
  (state: TRootState) => state.activeBlock.startIndex,
  (state: TRootState) => state.activeBlock.returnIndex,
  getParsedStructLogs,
)

export const selectParsedStack = createSelector(
  (state: TRootState) => state.structLogs.activeStructLog?.stack ?? [],
  getParsedStack,
)
export const selectParsedMemory = createSelector(
  (state: TRootState) => state.structLogs.activeStructLog?.memory ?? [],
  getParsedMemory,
)
export const selectStructlogStorage = createSelector(
  [(state: TRootState) => state.structLogs.activeStructLog?.storage],
  (state) => state ?? {},
)

export const {
  loadStructLogs,
  updateStackSelectionStatus,
  loadPreviousStructlog,
  loadNextStructlog,
  loadActiveStructLog,
} = structLogsSlice.actions
