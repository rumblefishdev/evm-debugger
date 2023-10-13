import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { instructionsAdapter } from './instructions.slice'

const selectInstructionsState = createSelector([selectReducer(StoreKeys.INSTRUCTIONS)], (state) => state)

const selectEntities = createSelector([selectInstructionsState], (state) => instructionsAdapter.getSelectors().selectEntities(state))

const selectByAddress = createSelector([selectInstructionsState, (_: unknown, address: string) => address], (_, address) =>
  instructionsAdapter.getSelectors().selectById(_, address),
)

export const instructionsSelectors = { selectEntities, selectByAddress }
