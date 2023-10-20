import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { IExtendedStructLog } from '../../types'

const activeStructLogSlice = createSlice({
  reducers: {
    setPreviousStructLogAsActive: (activeStructLog, action: PayloadAction<IExtendedStructLog[]>) => {
      if (activeStructLog.index > 0) activeStructLog = action.payload[activeStructLog.index - 1]
    },
    setNextStructLogAsActive: (activeStructLog, action: PayloadAction<IExtendedStructLog[]>) => {
      const totalStructLogsCount = action.payload.length
      if (activeStructLog.index < totalStructLogsCount - 1) activeStructLog = action.payload[activeStructLog.index + 1]
    },

    setActiveStrucLog: (activeStructLog, action: PayloadAction<IExtendedStructLog | null>) => {
      activeStructLog = action.payload
      return activeStructLog
    },
  },
  name: StoreKeys.ACTIVE_STRUCT_LOG,
  initialState: null as IExtendedStructLog | null,
})

export const activeStructLogReducer = activeStructLogSlice.reducer
export const activeStructLogActions = activeStructLogSlice.actions
