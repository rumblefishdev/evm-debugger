import { createSelector } from '@reduxjs/toolkit'
import type { TIndexedStructLog, TPcIndexedStepInstructions, TStepInstruction } from '@evm-debuger/types'
import { SourceFileType } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeStructLogSelectors } from '../activeStructLog/activeStructLog.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { structlogsSelectors } from '../structlogs/structlogs.selectors'
import type { IExtendedStructLog } from '../../types'

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
  [selectCurrentInstructions, structlogsSelectors.selectAllOffCurrentBlock],
  (_currentInstructions, _currentStructlogs) => {
    if (!_currentInstructions || !_currentStructlogs) {
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

const checkPreviousInstruction = (
  instructions: TPcIndexedStepInstructions,
  structlogs: TIndexedStructLog[],
  activeStructlog: TIndexedStructLog | IExtendedStructLog,
): TStepInstruction => {
  const currentInstruction = instructions[activeStructlog.pc]
  console.log('currentInstruction', currentInstruction)
  if (currentInstruction?.fileType === SourceFileType.UNKNOWN || currentInstruction?.fileId === -1) {
    const previousStructlog = structlogs[activeStructlog.index - 1]
    return checkPreviousInstruction(instructions, structlogs, previousStructlog)
  }

  return currentInstruction
}

const selectCurrentSourceCodeInstruction = createSelector(
  [selectCurrentInstructions, activeStructLogSelectors.selectActiveStructLog, structlogsSelectors.selectAll],
  (instructions, activeStructlog, structLogs) => {
    if (!activeStructlog) return null
    return checkPreviousInstruction(instructions, structLogs, activeStructlog)
  },
)

const selectCurrentFileId = createSelector([selectCurrentInstruction], (instruction) => instruction?.fileId)

export const instructionsSelectors = {
  selectIsCurrentInstructionsValid,
  selectEntities,
  selectCurrentSourceCodeInstruction,
  selectCurrentInstructions,
  selectCurrentInstruction,
  selectCurrentFileId,
  selectByAddress,
}
