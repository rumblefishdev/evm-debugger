import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TStepInstruction } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'

export const instructionsAdapter = createEntityAdapter<{ address: string; instructions: TStepInstruction[] }>({
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
