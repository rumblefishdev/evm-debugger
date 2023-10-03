import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

const activeSourceFileSlice = createSlice({
  reducers: {
    setActiveSourceFile: (state, action: PayloadAction<number>) => {
      state = action.payload
      return state
    },
  },
  name: StoreKeys.ACTIVE_SOURCE_FILE,
  initialState: 0,
})

export const activeSourceFileReducer = activeSourceFileSlice.reducer
export const activeSourceFileActions = activeSourceFileSlice.actions
