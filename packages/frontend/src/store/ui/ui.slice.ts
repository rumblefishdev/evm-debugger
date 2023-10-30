import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { IUIState } from './ui.types'

const uiInitialState: IUIState = {
  structLogsListOffset: 0,
}

export const uiSlice = createSlice({
  reducers: {
    setStructLogsListOffset: (state, action: PayloadAction<number>) => {
      state.structLogsListOffset = action.payload
    },
  },
  name: StoreKeys.UI,
  initialState: uiInitialState,
})

export const uiActions = uiSlice.actions
export const uiReducer = uiSlice.reducer

export type SourceCodesActions = ActionsType<typeof uiActions>
