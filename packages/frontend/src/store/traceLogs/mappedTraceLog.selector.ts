import { createSelector } from '@reduxjs/toolkit'

import type { TMainTraceLogsWithId, TIntrinsicLog, TTreeMapData } from '../../types'
import { sumReducer } from '../../helpers/helpers'
import { NestedMap } from '../../helpers/nestedTreeMap'
import type { TRootState } from '../store'

import { selectAllTraceLogs } from './traceLogs.slice'

const lastItemInContext = (rootItem: TMainTraceLogsWithId, state: TMainTraceLogsWithId[]) => {
  const lastItem = state.findIndex((item) => item.index > rootItem.index && item.depth === rootItem.depth)
  return lastItem === -1 ? state.length : lastItem
}

const getNestedItems = (rootItem: TMainTraceLogsWithId, state: TMainTraceLogsWithId[]): TMainTraceLogsWithId[] => {
  return state
    .slice(
      state.findIndex((item) => item.index === rootItem.index),
      lastItemInContext(rootItem, state),
    )
    .filter((item) => item.depth === rootItem.depth + 1)
}

const parseNestedArrayRecursive = (
  rootItem: TTreeMapData,
  state: TMainTraceLogsWithId[],
  height: number,
  width: number,
): TTreeMapData[] => {
  if ('owningLog' in rootItem.item) return []

  const nestedItems = getNestedItems(rootItem.item, state)

  if (nestedItems.length === 0) return []

  const gasSum = rootItem.item.gasCost - nestedItems.map((item) => item.gasCost).reduce(sumReducer, 0)

  const intrinsicLog: TIntrinsicLog = {
    owningLog: {
      type: rootItem.item.type,
      stackTrace: rootItem.item.stackTrace,
    },
    id: rootItem.item.id,
    gasCost: gasSum,
  }

  const mappedItems = new NestedMap(width, height, [...nestedItems, intrinsicLog]).mapItems()

  return mappedItems.map((item) => {
    const childNestedItems = parseNestedArrayRecursive({ ...item, nestedItems: [] }, state, item.dimensions.height, item.dimensions.width)
    return { ...item, nestedItems: childNestedItems }
  })
}

const selectTraceAsNestedArrays = (state: TMainTraceLogsWithId[], width: number, height: number): TTreeMapData => {
  const dimensions = { y: 0, x: 0, width, height }

  const rootItem = {
    nestedItems: [],
    item: state[0],
    dimensions,
  }

  return {
    ...rootItem,
    nestedItems: parseNestedArrayRecursive(rootItem, state, height, width),
  }
}

export const selectMappedTraceLogs = createSelector(
  [
    (state: TRootState) => selectAllTraceLogs(state),
    (state: TRootState, width: number) => width,
    (state: TRootState, width: number, height: number) => height,
  ],
  selectTraceAsNestedArrays,
)
