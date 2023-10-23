import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { IExtendedStructLog } from '../../types'

const initialState: number | null = null

const activeStructLogSlice = createSlice({
  reducers: {
    setPreviousStructLogAsActive: (activeStructLog, action: PayloadAction<IExtendedStructLog[]>) => {
      // if (activeStructLog.index > 0) activeStructLog = action.payload[activeStructLog.index - 1]
    },
    setNextStructLogAsActive: (activeStructLog, action: PayloadAction<IExtendedStructLog[]>) => {
      const totalStructLogsCount = action.payload.length
      // if (activeStructLog.index < totalStructLogsCount - 1) activeStructLog = action.payload[activeStructLog.index + 1]
    },

    setActiveStrucLog: (_, action: PayloadAction<number | null>) => {
      return action.payload
    },
  },
  name: StoreKeys.ACTIVE_STRUCT_LOG,
  initialState,
})

export const activeStructLogReducer = activeStructLogSlice.reducer
export const activeStructLogActions = activeStructLogSlice.actions
