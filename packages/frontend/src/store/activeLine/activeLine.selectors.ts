import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { instructionsSelectors } from '../instructions/instructions.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { structlogsSelectors } from '../structlogs/structlogs.selectors'
import { sourceCodesSelectors } from '../sourceCodes/sourceCodes.selectors'
import { activeSourceFileSelectors } from '../activeSourceFile/activeSourceFile.selectors'

const selectActiveLineState = createSelector([selectReducer(StoreKeys.ACTIVE_LINE)], (state) => state)

const selectActiveLine = createSelector([selectActiveLineState], (state) => state.line)

const selectActiveLineFileId = createSelector([selectActiveLineState], (state) => state.fileId)

const selectIsLineSelected = createSelector([selectActiveLineState], (state) => Boolean(state.fileId && state.line))

const selectStructlogsPerLine = createSelector([selectActiveLineState], (state) => state.structlogsPerActiveLine)

const selectStructlogsPerLineForActiveBlock = createSelector(
  [selectStructlogsPerLine, activeBlockSelectors.selectActiveBlock],
  (structlogsPerLine, { address }) => structlogsPerLine[address] || {},
)

const selectActiveLineInstruction = createSelector(
  [selectActiveLine, selectActiveLineFileId, instructionsSelectors.selectCurrentInstructions],
  (line, fileId, instructions) => {
    return Object.values(instructions).filter(
      (instruction) => line === instruction.startCodeLine && line <= instruction.endCodeLine && fileId === instruction.fileId,
    )
  },
)

const selectStructLogsForActiveLine = createSelector(
  [
    selectActiveLine,
    selectActiveLineFileId,
    selectStructlogsPerLine,
    activeBlockSelectors.selectActiveBlock,
    structlogsSelectors.selectPcIndexedStructLogs,
  ],
  (line, fileId, structLogsPerLine, { address }, structLogs) => {
    const currentStructLogsLineSet = structLogsPerLine[address]?.[fileId]?.[line]
    if (!currentStructLogsLineSet) return null

    return Array.from(currentStructLogsLineSet)
      .map((structLog) => structLogs[structLog.pc])
      .filter((item) => Boolean(item))
  },
)

const selectStructLogsForActiveLineMappedToIndex = createSelector([selectStructLogsForActiveLine], (structLogs) => {
  if (!structLogs?.length) return {}
  return structLogs.reduce((accumulator, structLog) => {
    accumulator[structLog.index] = structLog
    return accumulator
  }, {})
})

const selectCurrentSelectedSourceLineContent = createSelector(
  [sourceCodesSelectors.selectCurrentSourceFiles, selectActiveLine, selectActiveLineFileId],
  (sourceFiles, activeLine, fileId) => {
    const currentSourceFile = sourceFiles[fileId]
    if (!currentSourceFile) return ''

    const regexForAllNewLineTypes = /\r\n|\n|\r/g
    const sourceParts = currentSourceFile.sourceCode.split(regexForAllNewLineTypes)

    return sourceParts[activeLine]
  },
)

const selectAvailableLinesForCurrentFile = createSelector(
  [sourceCodesSelectors.selectCurrentSourceFiles, activeSourceFileSelectors.selectActiveSourceFile, selectStructlogsPerLineForActiveBlock],
  (sourceFiles, fileId, structLogsPerLine) => {
    const currentSourceFile = sourceFiles[fileId]
    if (!currentSourceFile) return []

    return Object.keys(structLogsPerLine[fileId]).map((line) => Number(line))
  },
)

export const activeLineSelectors = {
  selectStructLogsForActiveLineMappedToIndex,
  selectStructLogsForActiveLine,
  selectIsLineSelected,
  selectCurrentSelectedSourceLineContent,
  selectAvailableLinesForCurrentFile,
  selectActiveLineInstruction,
  selectActiveLineFileId,
  selectActiveLine,
}
