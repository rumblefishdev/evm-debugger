import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TSourceCodes } from './sourceCodes.types'

export const sourceCodesAdapter = createEntityAdapter<TSourceCodes>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const sourceCodesSlice = createSlice({
  reducers: {
    updateSourceCode: sourceCodesAdapter.updateOne,
    startPoolingSources: () => {},
    fetchSourceData: (_, __: PayloadAction<{ sourceDataPath: string; sourcesPath: string; contractAddress: string }>) => {},
    clearSourceCodes: sourceCodesAdapter.removeAll,
    addSourceCodes: sourceCodesAdapter.addMany,
    addSourceCode: sourceCodesAdapter.addOne,
  },
  name: StoreKeys.SOURCE_CODES,
  initialState: sourceCodesAdapter.getInitialState(),
})

export const sourceCodesActions = sourceCodesSlice.actions
export const sourceCodesReducer = sourceCodesSlice.reducer

export type SourceCodesActions = ActionsType<typeof sourceCodesActions>
