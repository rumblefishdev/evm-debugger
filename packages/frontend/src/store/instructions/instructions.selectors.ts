import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeStructLogSelectors } from '../activeStructLog/activeStructLog.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { structlogsSelectors } from '../structlogs/structlogs.selectors'
import { sourceMapsSelectors } from '../sourceMaps/sourceMaps.selectors'

import { instructionsAdapter } from './instructions.slice'
import { validateInstruction } from './instructions.helpers'

const selectInstructionsState = createSelector([selectReducer(StoreKeys.INSTRUCTIONS)], (state) => state)

const selectEntities = createSelector([selectInstructionsState], (state) => instructionsAdapter.getSelectors().selectEntities(state))

const selectByAddress = createSelector([selectInstructionsState, (_: unknown, address: string) => address], (_, address) =>
  instructionsAdapter.getSelectors().selectById(_, address),
)

const selectCurrentInstructions = createSelector([selectEntities, activeBlockSelectors.selectActiveBlock], (entities, activeBlock) => {
  return entities[activeBlock.address]?.instructions
})

const selectIsCurrentInstructionsValid = createSelector(
  [sourceMapsSelectors.selectIsCurrentSourceMapAvailable, selectCurrentInstructions, structlogsSelectors.selectAllOffCurrentBlock],
  (_isSourceMapAvailable, _currentInstructions, _currentStructlogs) => {
    if (!_currentInstructions || !_currentStructlogs || !_isSourceMapAvailable) {
      return false
    }

    return _currentStructlogs.slice(0, 10).every((structlog) => {
      const instruction = _currentInstructions[structlog.pc]
      return validateInstruction(instruction, structlog)
    })
  },
)

const selectCurrentInstruction = createSelector(
  [selectCurrentInstructions, activeStructLogSelectors.selectActiveStructLog],
  (instructions, activeStructlog) => {
    return instructions[activeStructlog?.pc]
  },
)

const selectCurrentFileId = createSelector([selectCurrentInstruction], (instruction) => instruction?.fileId)

export const instructionsSelectors = {
  selectIsCurrentInstructionsValid,
  selectEntities,
  selectCurrentInstructions,
  selectCurrentInstruction,
  selectCurrentFileId,
  selectByAddress,
}
