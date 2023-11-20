import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'


import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TAbiElement } from './abis.types'

export const abisAdapter = createEntityAdapter<TAbiElement>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const abisSlice = createSlice({
  reducers: {

    addAbis: abisAdapter.addMany
  },
  name: StoreKeys.ABIS,
  initialState: abisAdapter.getInitialState(),
})

export const abisActions = abisSlice.actions
export const abisReducer = abisSlice.reducer

export type AbisActions = ActionsType<typeof abisActions>
