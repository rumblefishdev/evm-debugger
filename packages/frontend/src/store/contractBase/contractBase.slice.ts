import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TAnalyzerContractBaseData } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const contractBaseAdapter = createEntityAdapter<TAnalyzerContractBaseData>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const contractBaseSlice = createSlice({
  reducers: {
    loadContractsBaseData: contractBaseAdapter.upsertMany,
    initializeContractsBase: (state, { payload }: PayloadAction<string[]>) => {
      contractBaseAdapter.addMany(
        state,
        payload.map((address) => ({ address })),
      )
    },
    clearContractsBase: contractBaseAdapter.removeAll,
  },
  name: StoreKeys.CONTRACT_BASE,
  initialState: contractBaseAdapter.getInitialState(),
})

export const contractBaseActions = contractBaseSlice.actions
export const contractBaseReducer = contractBaseSlice.reducer

export type ContractsActions = ActionsType<typeof contractBaseActions>
