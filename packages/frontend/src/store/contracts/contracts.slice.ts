import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TAnalyzerContractBaseData } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const contractsAdapter = createEntityAdapter<TAnalyzerContractBaseData>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const contractsSlice = createSlice({
  reducers: {
    updateContracts: contractsAdapter.updateMany,
    updateContract: contractsAdapter.updateOne,
    initializeContracts: (state, { payload }: PayloadAction<string[]>) => {
      contractsAdapter.addMany(
        state,
        payload.map((address) => ({ address })),
      )
    },
    clearContractNames: contractsAdapter.removeAll,
  },
  name: StoreKeys.CONTRACTS,
  initialState: contractsAdapter.getInitialState(),
})

export const contractsActions = contractsSlice.actions
export const contractsReducer = contractsSlice.reducer

export type ContractsActions = ActionsType<typeof contractsActions>
