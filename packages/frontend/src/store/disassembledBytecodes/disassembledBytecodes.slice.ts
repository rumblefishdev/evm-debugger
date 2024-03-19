import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TContractDissasembledBytecode } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const disassembledBytecodesAdapter = createEntityAdapter<TContractDissasembledBytecode>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const disassembledBytecodesSlice = createSlice({
  reducers: {
    updateBytecode: disassembledBytecodesAdapter.updateOne,
    loadBytecodes: disassembledBytecodesAdapter.addMany,
    fetchBytecodes: () => {},
    clearBytecodes: (state) => {
      disassembledBytecodesAdapter.removeAll(state)
    },
  },
  name: StoreKeys.DISASSEMBLED_BYTECODES,
  initialState: disassembledBytecodesAdapter.getInitialState(),
})

export const disassembledBytecodesActions = disassembledBytecodesSlice.actions
export const disassembledBytecodesReducer = disassembledBytecodesSlice.reducer

export type DisassembledBytecodesActionsActions = ActionsType<typeof disassembledBytecodesActions>
