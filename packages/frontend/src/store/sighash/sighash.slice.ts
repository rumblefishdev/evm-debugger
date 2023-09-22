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
    setAsFoundByAddress(sighashState, action: PayloadAction<string>) {
      const sighashesOfAddress = sighashAdapter
        .getSelectors()
        .selectAll(sighashState)
        .filter((sighash) => sighash.addresses.has(action.payload))
      sighashAdapter.updateMany(
        sighashState,
        sighashesOfAddress.map((sighash) => ({
          id: sighash.sighash,
          changes: { found: true },
        })),
      )
    },
    addSighashes: (sighashState, action: PayloadAction<TSighashStatus[]>) => {
      return sighashAdapter.setMany(sighashState, action.payload)
    },
  },
  name: StoreKeys.SIGHASH,
  initialState: sighashAdapter.getInitialState(),
})

export const sighashActions = sighashSlice.actions
export const sighashReducer = sighashSlice.reducer

export type SighhashActions = ActionsType<typeof sighashActions>
