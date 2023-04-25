import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import type { TContractNames } from '../../types'

const contractNamesAdapter = createEntityAdapter<TContractNames>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const contractNamesSlice = createSlice({
  reducers: {
    updateContractName: contractNamesAdapter.updateOne,
    addContractNames: contractNamesAdapter.addMany,
  },
  name: 'contractNames',
  initialState: contractNamesAdapter.getInitialState(),
})

export const { updateContractName, addContractNames } = contractNamesSlice.actions
export const contractNamesReducer = contractNamesSlice.reducer
export const contractNamesSelectors = contractNamesAdapter.getSelectors()
