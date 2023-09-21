import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { sourceMapsAdapter } from './sourceMaps.slice'

const selectSourceMapsState = createSelector([selectReducer(StoreKeys.SOURCE_MAPS)], (state) => state)

const selectAll = createSelector(selectSourceMapsState, sourceMapsAdapter.getSelectors().selectAll)

export const createSourceMapId = (address: string, contractName: string) => `${address}|${contractName}`

export const sourceMapsSelectors = {
  selectAll,
}
