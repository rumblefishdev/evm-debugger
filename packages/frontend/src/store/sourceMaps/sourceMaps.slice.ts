import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

import type { TSourceMapSlice } from './sourceMaps.types'

export const sourceMapsAdapter = createEntityAdapter<TSourceMapSlice>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => `${entity.address}|${entity.contractName}`,
})

export const sourceMapsSlice = createSlice({
  reducers: {
    clearSourceMaps: sourceMapsAdapter.removeAll,
    addSourceMaps: sourceMapsAdapter.addMany,
  },
  name: StoreKeys.SOURCE_MAPS,
  initialState: sourceMapsAdapter.getInitialState(),
})

export const sourceMapsActions = sourceMapsSlice.actions
export const sourceMapsReducer = sourceMapsSlice.reducer
