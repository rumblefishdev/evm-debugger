import { createSelector } from '@reduxjs/toolkit'

import type {
  TMainTraceLogsWithId,
  TDimmensions,
  TIntrinsicLog,
  TNestedTraceLogs,
  TNestedTreeMapItem,
} from '../../types'
import { createCallIdentifier, sumReducer } from '../../helpers/helpers'
import { NestedMap } from '../../helpers/nestedTreeMap'
import type { TRootState } from '../store'

import { traceLogsSelectors } from './traceLogs.slice'

const lastItemInContext = (
  rootItem: TMainTraceLogsWithId,
  state: TMainTraceLogsWithId[],
) => {
  const lastItem = state.findIndex(
    (item) => item.index > rootItem.index && item.depth === rootItem.depth,
  )
  return lastItem === -1 ? state.length : lastItem
}

const getTraceLogNestedLogs = (
  traceLog: TMainTraceLogsWithId,
  state: TMainTraceLogsWithId[],
) => {
  return state
    .slice(
      state.findIndex((item) => item.index === traceLog.index),
      lastItemInContext(traceLog, state),
    )
    .filter((item) => item.depth === traceLog.depth + 1)
}

const parseToNestedStructure = (
  rootItem: TMainTraceLogsWithId,
  state: TMainTraceLogsWithId[],
): (TNestedTraceLogs | TIntrinsicLog)[] => {
  const nestedItems = getTraceLogNestedLogs(rootItem, state)
  if (nestedItems.length === 0) return []

  const gasSum =
    rootItem.gasCost -
    nestedItems.map((item) => item.gasCost).reduce(sumReducer, 0)

  const intrinsicLog: TIntrinsicLog = {
    owningLog: createCallIdentifier(rootItem.stackTrace, rootItem.type),
    id: rootItem.id,
    gasCost: gasSum,
  }

  const iteratedItems: TNestedTraceLogs[] = nestedItems.map((item) => {
    return {
      ...item,
      nestedItems: parseToNestedStructure({ ...item }, state),
    }
  })

  return [...iteratedItems, intrinsicLog]
}

const applyNestedMapRecursive = (
  rootItem: TNestedTreeMapItem | (TIntrinsicLog & TDimmensions),
  width: number,
  height: number,
): (TNestedTreeMapItem | (TIntrinsicLog & TDimmensions))[] => {
  if ('owningLog' in rootItem) return []
  if (rootItem.nestedItems.length === 0) return []
  const mappedItems = new NestedMap(
    width,
    height,
    rootItem.nestedItems,
  ).mapItems()

  return mappedItems.map((item) => {
    return {
      ...item,
      nestedItems: applyNestedMapRecursive(item, item.width, item.height),
    }
  })
}

const applyNestedMap = (
  rootItem: TNestedTraceLogs,
  width: number,
  height: number,
): TNestedTreeMapItem => {
  if (rootItem.nestedItems.length === 0)
    return { ...rootItem, y: 0, x: 0, width, nestedItems: [], height }
  const mappedItems = new NestedMap(
    width,
    height,
    rootItem.nestedItems,
  ).mapItems()

  const test = mappedItems.map((item) => {
    return {
      ...item,
      nestedItems: applyNestedMapRecursive(item, item.width, item.height),
    }
  })

  return {
    ...rootItem,
    y: 0,
    x: 0,
    width,
    nestedItems: test,
    height,
  }
}

const selectTraceAsNestedArrays = (
  state: TMainTraceLogsWithId[],
  width: number,
  height: number,
): TNestedTreeMapItem => {
  const rootItem = {
    ...state[0],
    nestedItems: parseToNestedStructure(state[0], state),
  }

  return applyNestedMap(rootItem, width, height)
}

export const selectMappedTraceLogs = createSelector(
  [
    (state: TRootState) => traceLogsSelectors.selectAll(state.traceLogs),
    (state: TRootState, width: number) => width,
    (state: TRootState, width: number, height: number) => height,
  ],
  selectTraceAsNestedArrays,
)
