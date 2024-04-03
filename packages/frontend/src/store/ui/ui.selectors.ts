import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectUIState = createSelector([selectReducer(StoreKeys.UI)], (state) => state)

const selectStructlogListOffset = createSelector([selectUIState], (state) => state.structLogsListOffset)

const selectShouldShowProgressScreen = createSelector([selectUIState], (state) => state.shouldShowProgressScreen)

const selectShouldShowFunctionStackTrace = createSelector([selectUIState], (state) => state.shouldShowFunctionStackTrace)

const selectDisplayNonMainFunctions = createSelector([selectUIState], (state) => state.displayNonMainFunctions)

const selectDisplayYulFunctions = createSelector([selectUIState], (state) => state.displayYulFunctions)

const selectCurrentFunctionParameterId = createSelector([selectUIState], (state) => state.currentFunctionParameterId)

export const uiSelectors = {
  selectStructlogListOffset,
  selectShouldShowProgressScreen,
  selectShouldShowFunctionStackTrace,
  selectDisplayYulFunctions,
  selectDisplayNonMainFunctions,
  selectCurrentFunctionParameterId,
}
