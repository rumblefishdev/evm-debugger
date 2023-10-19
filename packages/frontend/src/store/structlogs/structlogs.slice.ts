import type { IStructLog } from '@evm-debuger/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

export const structLogsSlice = createSlice({
  reducers: {
    loadStructLogs: (state, action: PayloadAction<IStructLog[]>) => {
      return action.payload
    },
  },
  name: StoreKeys.STRUCT_LOGS,
  initialState: [] as IStructLog[],
})

export const structLogsReducer = structLogsSlice.reducer
export const structLogsActions = structLogsSlice.actions
export type IStructLogsActions = ActionsType<typeof structLogsActions>
