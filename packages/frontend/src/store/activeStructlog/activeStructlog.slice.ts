import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'
import type { IStructLog, TMainTraceLogs } from '@evm-debuger/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import { argStackExtractor } from '../../helpers/argStackExtractor'
import { extendStack } from '../../helpers/helpers'
import type { IExtendedStructLog } from '../../types'
import type { TRootState } from '../store'

const initialState: { structLogs: IStructLog[]; activeStructLog: IExtendedStructLog | null } = {
  structLogs: [],
  activeStructLog: null,
}

export const activeStructlogSlice = createSlice({
  reducers: {
    updateStackSelectionStatus: (state, action: PayloadAction<string>) => {
      const activeStructlog = state.activeStructLog

      if (activeStructlog) {
        const index = [...activeStructlog.stack].reverse().findIndex((item) => item.value === action.payload)
        const count = activeStructlog.stack.length - 1
        if (index !== -1) state.activeStructLog.stack[count - index].isSelected = !activeStructlog.stack[count - index].isSelected
      }
    },
    loadStructLogs: (state, action: PayloadAction<IStructLog[]>) => {
      state.structLogs = action.payload
    },

    loadPreviousStructlog: (state, action: PayloadAction<IExtendedStructLog[]>) => {
      if (state.activeStructLog.index > 0) state.activeStructLog = action.payload[state.activeStructLog.index - 1]
    },

    loadNextStructlog: (state, action: PayloadAction<IExtendedStructLog[]>) => {
      if (state.activeStructLog.index < state.structLogs.length - 1) state.activeStructLog = action.payload[state.activeStructLog.index + 1]
    },
    loadActiveStructLog: (state, action: PayloadAction<IExtendedStructLog | null>) => {
      state.activeStructLog = action.payload
    },
  },
  name: 'activeStructlog',
  initialState,
})

export const activeStructlogReducer = activeStructlogSlice.reducer

export const isStructLogActive = (state: TRootState, index: number): boolean => {
  return state.activeStructlog.activeStructLog?.index === index
}

export const getParsedStructLogs = (
  structLogs: IStructLog[],
  traceLogs: TMainTraceLogs[],
  startIndex: number,
  returnIndex: number
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
          gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)?.gasCost,
        }

      return {
        ...argStackExtractor(item),
        stack: extendStack(item.stack),
        index,
      }
    })
}

export const selectParsedStructLogs = createSelector(
  (state: TRootState) => state.activeStructlog.structLogs,
  (state: TRootState) => state.traceLogs,
  (state: TRootState) => state.activeBlock.startIndex,
  (state: TRootState) => state.activeBlock.returnIndex,
  getParsedStructLogs
)

export const selectStructlogStack = createSelector(
  [(state: TRootState) => state.activeStructlog.activeStructLog?.stack],
  (state) => state ?? []
)
export const selectStructlogMemory = createSelector(
  [(state: TRootState) => state.activeStructlog.activeStructLog?.memory],
  (state) => state ?? []
)
export const selectStructlogStorage = createSelector(
  [(state: TRootState) => state.activeStructlog.activeStructLog?.storage],
  (state) => state ?? {}
)

export const { loadStructLogs, updateStackSelectionStatus, loadPreviousStructlog, loadNextStructlog, loadActiveStructLog } =
  activeStructlogSlice.actions

// state.structLogs = structLogs
//   .slice(startIndex, returnIndex)
//   .filter((item) => item.depth === structLogs[startIndex].depth)
//   .map((item, index) => {
//     if (checkIfOfCallType(item) || checkIfOfCreateType(item))
//       return {
//         ...argStackExtractor(item),
//         stack: extendStack(item.stack),
//         index,
//         gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)?.gasCost,
//       }

//     return {
//       ...argStackExtractor(item),
//       stack: extendStack(item.stack),
//       index,
//     }
//   })
