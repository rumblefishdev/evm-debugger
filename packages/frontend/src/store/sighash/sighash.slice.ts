import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TSighashStatus } from '@evm-debuger/types'

const sighashAdapter = createEntityAdapter<TSighashStatus>({
  sortComparer: (a, b) => a.sighash.localeCompare(b.sighash),
  selectId: (entity) => entity.sighash,
})

export const sighashSlice = createSlice({
  reducers: {
    updateSighash: sighashAdapter.updateOne,
    setAsFoundByAddress(sighashState, action: PayloadAction<string>) {
      const keys = Object.keys(sighashState.entities)
      const sighashesOfAddress = keys.filter((entity) => sighashState.entities[entity].addresses.has(action.payload))
      sighashesOfAddress.forEach((sighash) => {
        sighashState.entities[sighash].found = true
      })
    },
    addSighashes: sighashAdapter.addMany,
  },
  name: 'sighash',
  initialState: sighashAdapter.getInitialState(),
})

export const sighashReducer = sighashSlice.reducer
export const sighashSelectors = sighashAdapter.getSelectors()
