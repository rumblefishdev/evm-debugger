import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TSighashStatus } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const sighashAdapter = createEntityAdapter<TSighashStatus>({
  sortComparer: (a, b) => a.sighash.localeCompare(b.sighash),
  selectId: (entity) => entity.sighash,
})

export const sighashSlice = createSlice({
  reducers: {
    updateSighash: sighashAdapter.updateOne,
    clearSighashes: sighashAdapter.removeAll,
    addSighashes: sighashAdapter.addMany,
  },
  name: StoreKeys.SIGHASH,
  initialState: sighashAdapter.getInitialState(),
})

export const sighashActions = sighashSlice.actions
export const sighashReducer = sighashSlice.reducer

export type SighhashActions = ActionsType<typeof sighashActions>
