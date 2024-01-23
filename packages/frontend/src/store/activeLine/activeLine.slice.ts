import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

const activeLineSlice = createSlice({
  reducers: {
    setActiveLine: (state, action: PayloadAction<number>) => {
      state = action.payload
      return state
    },
  },
  name: StoreKeys.ACTIVE_LINE,
  initialState: -1,
})

export const activeLineReducer = activeLineSlice.reducer
export const activeLineActions = activeLineSlice.actions
