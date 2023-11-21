import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TBytecodes, TInitializeBytecodesPayload } from './bytecodes.types'

export const bytecodesAdapter = createEntityAdapter<TBytecodes>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const bytecodesSlice = createSlice({
  reducers: {
    updateBytecode: bytecodesAdapter.updateOne,
    initializeBytecodes: (state, action: PayloadAction<TInitializeBytecodesPayload>) => {
      const emptyBytecodes = action.payload.map((address) => ({ error: null, disassembled: null, bytecode: null, address }))
      bytecodesAdapter.addMany(state, emptyBytecodes)
    },
    fetchBytecodes: () => {},
    clearBytecodes: (state) => {
      bytecodesAdapter.removeAll(state)
    },
  },
  name: StoreKeys.BYTECODES,
  initialState: bytecodesAdapter.getInitialState(),
})

export const bytecodesActions = bytecodesSlice.actions
export const bytecodesReducer = bytecodesSlice.reducer

export type BytecodesActions = ActionsType<typeof bytecodesActions>
