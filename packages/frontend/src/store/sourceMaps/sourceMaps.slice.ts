import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TSourceMapSlice } from './sourceMaps.types'

export const sourceMapsAdapter = createEntityAdapter<TSourceMapSlice>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => `${entity.address}|${entity.contractName}`,
})

export const sourceMapsSlice = createSlice({
  reducers: {
    fetchSourceMaps: (_, __: PayloadAction<{ paths: string[]; contractAddress: string }>) => {},
    clearSourceMaps: sourceMapsAdapter.removeAll,
    addSourceMaps: sourceMapsAdapter.addMany,
  },
  name: StoreKeys.SOURCE_MAPS,
  initialState: sourceMapsAdapter.getInitialState(),
})

export const sourceMapsActions = sourceMapsSlice.actions
export const sourceMapsReducer = sourceMapsSlice.reducer
export type TSourceMapsActions = ActionsType<typeof sourceMapsActions>
