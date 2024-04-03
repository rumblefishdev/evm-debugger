import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

const initialState: number | null = null

const activeStructLogSlice = createSlice({
  reducers: {
    setActiveStrucLog: (_, action: PayloadAction<number | null>) => {
      return action.payload
    },
  },
  name: StoreKeys.ACTIVE_STRUCT_LOG,
  initialState,
})

export const activeStructLogReducer = activeStructLogSlice.reducer
export const activeStructLogActions = activeStructLogSlice.actions
