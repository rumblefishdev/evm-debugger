import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TFunctionStack } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const functionStackAdapter = createEntityAdapter<TFunctionStack>({
  sortComparer: (a, b) => a.index - b.index,
  selectId: (item) => item.index,
})

export const functionStackSlice = createSlice({
  reducers: {
    loadFunctionsStacks: functionStackAdapter.upsertMany,
  },
  name: StoreKeys.FUNCTION_STACK,
  initialState: functionStackAdapter.getInitialState(),
})

export const functionStackActions = functionStackSlice.actions
export const functionStackReducer = functionStackSlice.reducer

export type ContractsActions = ActionsType<typeof functionStackActions>
