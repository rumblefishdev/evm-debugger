import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TContractNames, TInitializeContractNamesPayload } from './contractNames.types'

export const contractNamesAdapter = createEntityAdapter<TContractNames>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const contractNamesSlice = createSlice({
  reducers: {
    updateContractNames: contractNamesAdapter.updateMany,
    updateContractName: contractNamesAdapter.updateOne,
    initializeContractNames: (state, action: PayloadAction<TInitializeContractNamesPayload>) => {
      const emptyContractNames = action.payload.map((address) => ({ contractName: null, address }))
      contractNamesAdapter.addMany(state, emptyContractNames)
    },
    clearContractNames: contractNamesAdapter.removeAll,
  },
  name: StoreKeys.CONTRACT_NAMES,
  initialState: contractNamesAdapter.getInitialState(),
})

export const contractNamesActions = contractNamesSlice.actions
export const contractNamesReducer = contractNamesSlice.reducer

export type ContractNamesActions = ActionsType<typeof contractNamesActions>
