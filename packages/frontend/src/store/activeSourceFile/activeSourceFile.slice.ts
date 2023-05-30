import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const activeSourceFileSlice = createSlice({
  reducers: {
    setActiveSourceFile: (state, action: PayloadAction<number>) => {
      state = action.payload
      return state
    },
  },
  name: 'activeSourceFile',
  initialState: 0,
})

export const activeSourceFileReducer = activeSourceFileSlice.reducer
export const { setActiveSourceFile } = activeSourceFileSlice.actions
