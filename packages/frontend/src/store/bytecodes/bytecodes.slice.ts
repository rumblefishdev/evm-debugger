import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import type { TBytecodes } from '../../types'

const bytecodesAdapter = createEntityAdapter<TBytecodes>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const bytecodesSlice = createSlice({
  reducers: {
    updateBytecode: bytecodesAdapter.updateOne,
    addBytecodes: bytecodesAdapter.addMany,
  },
  name: 'bytecodes',
  initialState: bytecodesAdapter.getInitialState(),
})

export const { addBytecodes, updateBytecode } = bytecodesSlice.actions
export const bytecodesReducer = bytecodesSlice.reducer
export const bytecodesSelectors = bytecodesAdapter.getSelectors()
