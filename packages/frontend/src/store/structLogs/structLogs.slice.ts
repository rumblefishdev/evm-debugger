import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IStructLog } from '@evm-debuger/types'

const initialState = [] as IStructLog[]

export const structLogsSlice = createSlice({
  reducers: {
    loadStructLogs: (state, action: PayloadAction<string>) => {
      return JSON.parse(action.payload) as IStructLog[]
    },
  },
  name: 'structLogs',
  initialState,
})

export const structLogsReducer = structLogsSlice.reducer

export const { loadStructLogs } = structLogsSlice.actions
