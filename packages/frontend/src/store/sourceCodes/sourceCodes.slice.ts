import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import type { TSourceCodes } from '../../types'
import { StoreKeys } from '../store.keys'

const sourceCodesAdapter = createEntityAdapter<TSourceCodes>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const sourceCodesSlice = createSlice({
  reducers: {
    updateSourceCode: sourceCodesAdapter.updateOne,
    addSourceCodes: sourceCodesAdapter.addMany,
  },
  name: StoreKeys.SOURCE_CODES,
  initialState: sourceCodesAdapter.getInitialState(),
})

export const { updateSourceCode, addSourceCodes } = sourceCodesSlice.actions
export const sourceCodesReducer = sourceCodesSlice.reducer
export const sourceCodesSelectors = sourceCodesAdapter.getSelectors()
