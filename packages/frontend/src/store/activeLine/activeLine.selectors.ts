import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { instructionsSelectors } from '../instructions/instructions.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { structlogsSelectors } from '../structlogs/structlogs.selectors'

const selectActiveLineState = createSelector([selectReducer(StoreKeys.ACTIVE_LINE)], (state) => state)

const selectActiveLine = createSelector([selectActiveLineState], (state) => state)

const selectStructlogsPerLine = createSelector([selectActiveLine], (state) => state.structlogsPerActiveLine)

const selectActiveLineInstruction = createSelector(
  [selectActiveLine, instructionsSelectors.selectCurrentInstructions],
  ({ line, fileId }, instructions) => {
    return Object.values(instructions).filter(
      (instruction) => line === instruction.startCodeLine && line <= instruction.endCodeLine && fileId === instruction.fileId,
    )
  },
)

const selectStructLogsForActiveLine = createSelector(
  [selectActiveLine, selectStructlogsPerLine, activeBlockSelectors.selectActiveBlock, structlogsSelectors.selectPcIndexedStructLogs],
  ({ line, fileId }, structLogsPerLine, { address }, structLogs) => {
    console.log('selectStructLogsForActiveLine', line, fileId, address)
    const currentStructLogsLineSet = structLogsPerLine[address]?.[fileId]?.[line]
    if (!currentStructLogsLineSet) return []

    console.log('blockStructlogs', structLogs)
    console.log('structlogsPerLine', structLogsPerLine)

    console.log('currentStructLogsLineSet', currentStructLogsLineSet)

    return Array.from(currentStructLogsLineSet).map((structLog, index) => ({ ...structLogs[structLog.pc], listIndex: index }))
  },
)

export const activeLineSelectors = { selectStructLogsForActiveLine, selectActiveLineInstruction, selectActiveLine }
