import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { TMainTraceLogsWithId } from '../traceLogs/traceLogs.types'
import type { ActionsType } from '../store.types'

const initialState: null | TMainTraceLogsWithId = null

export const activeBlockSlice = createSlice({
  reducers: {
    loadActiveBlock: (state, action: PayloadAction<TMainTraceLogsWithId>) => {
      return action.payload
    },
  },
  name: StoreKeys.ACTIVE_BLOCK,
  initialState,
})

export const activeBlockReducer = activeBlockSlice.reducer
export const activeBlockActions = activeBlockSlice.actions

export type ActiveBlockActions = ActionsType<typeof activeBlockActions>
