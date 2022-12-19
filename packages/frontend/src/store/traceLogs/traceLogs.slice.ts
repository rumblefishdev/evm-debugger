import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { TMainTraceLogs } from '@evm-debuger/types'

import type { TParsedExtendedTraceLog, TTraceLog } from '../../types'
import type { TRootState } from '../store'
import { sumReducer } from '../../helpers/helpers'
import { NestedMap } from '../../helpers/nestedTreeMap'

const initialState = [] as TMainTraceLogs[]

const lastItemInContext = (rootItem: TParsedExtendedTraceLog, state: TTraceLog[]) => {
  const lastItem = state.findIndex((item) => item.index > rootItem.index && item.depth === rootItem.depth)
  return lastItem === -1 ? state.length : lastItem
}

const parseRecursive = (
  rootItem: TParsedExtendedTraceLog,
  state: TTraceLog[],
  width: number,
  height: number,
  margin: number
): TParsedExtendedTraceLog[] => {
  if (!rootItem.nestedItems || rootItem.nestedItems.length === 0) return [] as TParsedExtendedTraceLog[]

  const nestedItems = rootItem.nestedItems
    .slice(
      state.findIndex((item) => item.index === rootItem.index),
      lastItemInContext(rootItem, state)
    )
    .filter((item) => item.depth === rootItem.depth + 1)

  if (nestedItems.length === 0) return [] as TParsedExtendedTraceLog[]

  const gasSum = rootItem.gasCost - nestedItems.map((item) => item.gasCost).reduce(sumReducer, 0)
  const blockData = {
    type: 'Gas Leftover',
    stackTrace: [],
    nestedItems: null,
    index: 100_000,
    gasCost: gasSum,
  } as unknown as TParsedExtendedTraceLog

  nestedItems.push(blockData)

  const nestedMap = new NestedMap(width, height - margin, rootItem.gasCost, nestedItems)

  const nestedExtendedItems = nestedMap.mapItems()

  return nestedExtendedItems.map((item) => {
    return {
      ...item,
      nestedItems: parseRecursive({ ...item, nestedItems: state as TParsedExtendedTraceLog[] }, state, item.width, item.height, margin),
    }
  })
}

const selectTraceAsNestedArrays = (state: TTraceLog[], width: number, height: number, margin: number) => {
  const rootItem = {
    ...state[0],
    y: 0,
    x: 0,
    width,
    nestedItems: state.length > 1 ? state.slice(1) : [],
    height,
  } as TParsedExtendedTraceLog

  if (rootItem.nestedItems) rootItem.nestedItems = parseRecursive(rootItem, state, width, height, margin)

  return rootItem
}

export const traceLogsSlice = createSlice({
  reducers: {
    loadTraceLogs: (state, action: PayloadAction<TMainTraceLogs[]>) => {
      return action.payload
    },
  },
  name: 'traceLogs',
  initialState,
})

export const traceLogsReducer = traceLogsSlice.reducer

export const { loadTraceLogs } = traceLogsSlice.actions

export const selectMappedTraceLogs = createSelector(
  [
    (state: TRootState) => state.traceLogs,
    (state: TRootState, width: number) => width,
    (state: TRootState, width: number, height: number) => height,
    (stage: TRootState, width: number, height: number, margin: number) => margin,
  ],
  selectTraceAsNestedArrays
)
