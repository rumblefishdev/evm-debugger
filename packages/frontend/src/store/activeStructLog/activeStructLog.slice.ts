import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { IExtendedStructLog } from '../../types'

const initialState: (IExtendedStructLog & { listIndex: number }) | null = null

const activeStructLogSlice = createSlice({
  reducers: {
    setActiveStrucLog: (_, action: PayloadAction<(IExtendedStructLog & { listIndex: number }) | null>) => {
      return action.payload
    },
  },
  name: StoreKeys.ACTIVE_STRUCT_LOG,
  initialState,
})

export const activeStructLogReducer = activeStructLogSlice.reducer
export const activeStructLogActions = activeStructLogSlice.actions
