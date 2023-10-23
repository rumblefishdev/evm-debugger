import { createSelector } from '@reduxjs/toolkit'
import { act } from 'react-dom/test-utils'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeStructLogSelectors } from '../activeStructLog/activeStructLog.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'

import { instructionsAdapter } from './instructions.slice'

const selectInstructionsState = createSelector([selectReducer(StoreKeys.INSTRUCTIONS)], (state) => state)

const selectEntities = createSelector([selectInstructionsState], (state) => instructionsAdapter.getSelectors().selectEntities(state))

const selectByAddress = createSelector([selectInstructionsState, (_: unknown, address: string) => address], (_, address) =>
  instructionsAdapter.getSelectors().selectById(_, address),
)

const selectCurrentInstruction = createSelector(
  [selectEntities, activeStructLogSelectors.selectActiveStructLog, activeBlockSelectors.selectActiveBlock],
  (entities, activeStructlog, activeBlock) => {
    return entities[activeBlock.address].instructions[activeStructlog?.pc]
  },
)

const selectCurrentFileId = createSelector([selectCurrentInstruction], (instruction) => instruction?.fileId)

export const instructionsSelectors = { selectEntities, selectCurrentInstruction, selectCurrentFileId, selectByAddress }
