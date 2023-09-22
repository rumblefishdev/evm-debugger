import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TInstructionsMap } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'

const instructionsAdapter = createEntityAdapter<TInstructionsMap>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const instructionsSlice = createSlice({
  reducers: {
    updateInstructions: instructionsAdapter.updateOne,
    addInstructions: instructionsAdapter.addMany,
  },
  name: StoreKeys.INSTRUCTIONS,
  initialState: instructionsAdapter.getInitialState(),
})

export const { updateInstructions, addInstructions } = instructionsSlice.actions
export const instructionsReducer = instructionsSlice.reducer
export const instructionsSelectors = instructionsAdapter.getSelectors()
