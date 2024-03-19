import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { TAnalyzerContractRawData } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const contractRawAdapter = createEntityAdapter<TAnalyzerContractRawData>({
  sortComparer: (a, b) => a.address.localeCompare(b.address),
  selectId: (entity) => entity.address,
})

export const contractRawSlice = createSlice({
  reducers: {
    updateOne: contractRawAdapter.updateOne,
    updateMany: contractRawAdapter.updateMany,
    startPoolingSources: () => {},
    loadContractsRawData: contractRawAdapter.upsertMany,
    fetchSourceMaps: (_, __: PayloadAction<{ path: string; contractAddress: string }>) => {},
    fetchSourceData: (_, __: PayloadAction<{ sourceDataPath: string; sourcesPath: string; contractAddress: string }>) => {},
    fetchBytecodes: () => {},
    clearContractsRaw: contractRawAdapter.removeAll,
  },
  name: StoreKeys.CONTRACT_RAW,
  initialState: contractRawAdapter.getInitialState(),
})

export const contractRawActions = contractRawSlice.actions
export const contractRawReducer = contractRawSlice.reducer

export type ContractRawActions = ActionsType<typeof contractRawActions>
