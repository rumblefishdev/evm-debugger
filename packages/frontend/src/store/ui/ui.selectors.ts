import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectUIState = createSelector([selectReducer(StoreKeys.UI)], (state) => state)

const selectStructlogListOffset = createSelector([selectUIState], (state) => state.structLogsListOffset)

const selectShouldShowProgressScreen = createSelector([selectUIState], (state) => state.shouldShowProgressScreen)

const selectShouldShowFunctionStackTrace = createSelector([selectUIState], (state) => state.shouldShowFunctionStackTrace)

const selectDisplayMainFunctions = createSelector([selectUIState], (state) => state.displayMainFunctions)

const selectDisplayYulFunctions = createSelector([selectUIState], (state) => state.displayYulFunctions)

export const uiSelectors = {
  selectStructlogListOffset,
  selectShouldShowProgressScreen,
  selectShouldShowFunctionStackTrace,
  selectDisplayYulFunctions,
  selectDisplayMainFunctions,
}
