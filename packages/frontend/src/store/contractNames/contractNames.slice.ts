import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import type { TContractNames } from '../../types'
import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const contractNamesAdapter = createEntityAdapter<TContractNames>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const contractNamesSlice = createSlice({
  reducers: {
    updateContractName: contractNamesAdapter.updateOne,
    addContractNames: contractNamesAdapter.addMany,
  },
  name: StoreKeys.CONTRACT_NAMES,
  initialState: contractNamesAdapter.getInitialState(),
})

export const contractNamesActions = contractNamesSlice.actions
export const contractNamesReducer = contractNamesSlice.reducer

export type ContractNamesActions = ActionsType<typeof contractNamesActions>
