import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { instructionsAdapter } from './instructions.slice'

const selectInstructionsState = createSelector([selectReducer(StoreKeys.INSTRUCTIONS)], (state) => state)

const selectAll = createSelector([selectInstructionsState], instructionsAdapter.getSelectors().selectAll)

const selectByAddress = createSelector([selectAll, (_: unknown, address: string) => address], (instructions, address) =>
  instructions.filter((instruction) => instruction.address === address),
)

export const instructionsSelectors = { selectByAddress, selectAll }
