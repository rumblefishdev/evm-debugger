import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectUIState = createSelector([selectReducer(StoreKeys.UI)], (state) => state)

const selectStructlogListOffset = createSelector([selectUIState], (state) => state.structLogsListOffset)

export const uiSelectors = { selectStructlogListOffset }
