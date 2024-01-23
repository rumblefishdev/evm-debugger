import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { instructionsSelectors } from '../instructions/instructions.selectors'

const selectActiveLineState = createSelector([selectReducer(StoreKeys.ACTIVE_LINE)], (state) => state)

const selectActiveLine = createSelector([selectActiveLineState], (state) => state)

const selectActiveLineInstruction = createSelector(
  [selectActiveLine, instructionsSelectors.selectCurrentInstructions],
  (activeLine, instructions) => {
    return Object.values(instructions).filter(({ endCodeLine, startCodeLine }) => activeLine >= startCodeLine && activeLine <= endCodeLine)
  },
)

export const activeLineSelectors = { selectActiveLineInstruction, selectActiveLine }
