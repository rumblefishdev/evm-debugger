import type { IStructLog } from '@evm-debuger/types'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const structLogsAdapter = createEntityAdapter<IStructLog>({
  sortComparer: (a, b) => a.index - b.index,
  selectId: (entity) => entity.index,
})

export const structLogsSlice = createSlice({
  reducers: {
    loadStructLogs: structLogsAdapter.setMany,
  },
  name: StoreKeys.STRUCT_LOGS,
  initialState: structLogsAdapter.getInitialState(),
})

export const structLogsReducer = structLogsSlice.reducer
export const structLogsActions = structLogsSlice.actions
export type IStructLogsActions = ActionsType<typeof structLogsActions>
