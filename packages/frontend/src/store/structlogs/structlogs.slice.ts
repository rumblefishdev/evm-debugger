import type { TIndexedStructLog } from '@evm-debuger/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TFetchStructlogsPayload } from './structlogs.types'

export const structLogsAdapter = createEntityAdapter<TIndexedStructLog>({
  sortComparer: (a, b) => a.index - b.index,
  selectId: (entity) => entity.index,
})

export const structLogsSlice = createSlice({
  reducers: {
    startPreparingStructlogs: () => {},
    loadStructLogs: (state, action: PayloadAction<TIndexedStructLog[]>) => {
      structLogsAdapter.addMany(state, action.payload)
    },
    fetchStructlogs: (_, __: PayloadAction<TFetchStructlogsPayload>) => {},
    clearStructLogs: (state) => {
      structLogsAdapter.removeAll(state)
    },
  },
  name: StoreKeys.STRUCT_LOGS,
  initialState: structLogsAdapter.getInitialState(),
})

export const structLogsReducer = structLogsSlice.reducer
export const structLogsActions = structLogsSlice.actions
export type TStructLogsActions = ActionsType<typeof structLogsActions>
