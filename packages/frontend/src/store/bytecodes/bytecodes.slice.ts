import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TAnalyzerContractBytecodeOutput } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const bytecodesAdapter = createEntityAdapter<TAnalyzerContractBytecodeOutput>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const bytecodesSlice = createSlice({
  reducers: {
    updateBytecode: bytecodesAdapter.updateOne,
    loadBytecodes: bytecodesAdapter.addMany,
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
