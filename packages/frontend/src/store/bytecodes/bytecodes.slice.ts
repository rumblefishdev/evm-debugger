import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import type { TBytecodes } from '../../types'
import { StoreKeys } from '../store.keys'

export const bytecodesAdapter = createEntityAdapter<TBytecodes>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const bytecodesSlice = createSlice({
  reducers: {
    updateBytecode: bytecodesAdapter.updateOne,
    addBytecodes: bytecodesAdapter.addMany,
  },
  name: StoreKeys.BYTECODES,
  initialState: bytecodesAdapter.getInitialState(),
})

export const { addBytecodes, updateBytecode } = bytecodesSlice.actions
export const bytecodesReducer = bytecodesSlice.reducer
export const bytecodesSelectors = bytecodesAdapter.getSelectors()
