import type { PayloadAction } from '@reduxjs/toolkit'
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
  activeSourceFileId: 0,
})

export const sourceFilesSlice = createSlice({
  reducers: {
    setActiveSourceFileId: (state, { payload }: PayloadAction<number>) => {
      state.activeSourceFileId = payload
    },
    loadContractsSourceFiles: sourceFilesAdapter.addMany,
    loadContractSourceFiles: sourceFilesAdapter.addOne,
    clearContractsSourceFiles: sourceFilesAdapter.removeAll,
  },
  name: StoreKeys.SOURCE_FILES,
  initialState: sourceFilesInitialState,
})

export const sourceFilesActions = sourceFilesSlice.actions
export const sourceFilesReducer = sourceFilesSlice.reducer
export type TSourceFilesActions = ActionsType<typeof sourceFilesActions>
