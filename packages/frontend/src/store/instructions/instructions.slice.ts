import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

import type { TInstructionState } from './instructions.types'

export const instructionsAdapter = createEntityAdapter<TInstructionState>({
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
