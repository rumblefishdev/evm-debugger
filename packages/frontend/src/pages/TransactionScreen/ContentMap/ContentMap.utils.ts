import { sumReducer } from '../../../helpers/helpers'
import { NestedMap } from '../../../helpers/nestedTreeMap'
import type { TMainTraceLogsWithId } from '../../../store/traceLogs/traceLogs.types'
import type { TIntrinsicLog, TTreeMapData } from '../../../types'

export const lastItemInContext = (rootItem: TMainTraceLogsWithId, state: TMainTraceLogsWithId[]) => {
  const lastItem = state.findIndex((item) => item.index > rootItem.index && item.depth === rootItem.depth)
  return lastItem === -1 ? state.length : lastItem
}

export const getNestedItems = (rootItem: TMainTraceLogsWithId, state: TMainTraceLogsWithId[]): TMainTraceLogsWithId[] => {
  return state
    .slice(
      state.findIndex((item) => item.index === rootItem.index),
      lastItemInContext(rootItem, state),
    )
    .filter((item) => item.depth === rootItem.depth + 1)
}

export const parseNestedArrayRecursive = (
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
export const generateTraceLogsMap = (traceLogs, { width, height }) => {
  const dimensions = { y: 0, x: 0, width, height }

  const rootItem = {
    nestedItems: [],
    item: traceLogs[0],
    dimensions,
  }

  return {
    ...rootItem,
    nestedItems: parseNestedArrayRecursive(rootItem, traceLogs, height, width),
  }
}
