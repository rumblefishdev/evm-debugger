import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TContractInstructions } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'

export const instructionsAdapter = createEntityAdapter<TContractInstructions>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const instructionsSlice = createSlice({
  reducers: {
    clearInstructions: instructionsAdapter.removeAll,
    addInstructions: instructionsAdapter.addMany,
  },
  name: StoreKeys.INSTRUCTIONS,
  initialState: instructionsAdapter.getInitialState(),
})

export const instructionsActions = instructionsSlice.actions
export const instructionsReducer = instructionsSlice.reducer
