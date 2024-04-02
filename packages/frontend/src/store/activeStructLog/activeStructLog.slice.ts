import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { TStructlogWithListIndex } from '../structlogs/structlogs.types'

const initialState: TStructlogWithListIndex | null = null

const activeStructLogSlice = createSlice({
  reducers: {
    setActiveStrucLog: (_, action: PayloadAction<TStructlogWithListIndex | null>) => {
      console.log('setActiveStrucLog', action.payload)
      return action.payload
    },
  },
  name: StoreKeys.ACTIVE_STRUCT_LOG,
  initialState,
})

export const activeStructLogReducer = activeStructLogSlice.reducer
export const activeStructLogActions = activeStructLogSlice.actions
