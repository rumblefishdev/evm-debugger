import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TSighahsStatus } from '@evm-debuger/types'

const sighashAdapter = createEntityAdapter<TSighahsStatus>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.sighash,
})

export const sighashSlice = createSlice({
  reducers: {
    updateSighash: sighashAdapter.updateOne,
    setAsFoundByAddress(sighashState, action: PayloadAction<string>) {
      const keys = Object.keys(sighashState.entities)
      const sighashesOfAddress = keys.filter((entity) => entity === action.payload)
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
