import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TContractSourceFiles } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TSourceFilesState } from './sourceFiles.types'

export const sourceFilesAdapter = createEntityAdapter<TContractSourceFiles>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const sourceFilesInitialState: TSourceFilesState = sourceFilesAdapter.getInitialState({
  activeSourceFile: '',
})

export const sourceFilesSlice = createSlice({
  reducers: {
    loadContractsSourceFiles: sourceFilesAdapter.addMany,
    loadContractSourceFiles: sourceFilesAdapter.addOne,
  },
  name: StoreKeys.SOURCE_FILES,
  initialState: sourceFilesInitialState,
})

export const sourceFilesActions = sourceFilesSlice.actions
export const sourceFilesReducer = sourceFilesSlice.reducer
export type TSourceFilesActions = ActionsType<typeof sourceFilesActions>
