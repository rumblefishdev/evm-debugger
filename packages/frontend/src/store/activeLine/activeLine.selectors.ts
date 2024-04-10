import { createSelector } from '@reduxjs/toolkit'
import { checkOpcodeIfOfCallGroupType } from '@evm-debuger/analyzer'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { instructionsSelectors } from '../instructions/instructions.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { structlogsSelectors } from '../structlogs/structlogs.selectors'
import type { TStructlogWithListIndex } from '../structlogs/structlogs.types'
import { sourceFilesSelectors } from '../sourceFiles/sourceFiles.selectors'

const selectActiveLineState = createSelector([selectReducer(StoreKeys.ACTIVE_LINE)], (state) => state)

const selectActiveLine = createSelector([selectActiveLineState], (state) => state.line)

const selectIsLineSelected = createSelector([selectActiveLineState], (state) => Boolean(state.line))

const selectStructlogsPerLine = createSelector([selectActiveLineState], (state) => state.structlogsPerActiveLine)

const selectStructlogsPerLineForActiveBlock = createSelector(
  [selectStructlogsPerLine, activeBlockSelectors.selectActiveBlock],
  (structlogsPerLine, { address }) => structlogsPerLine[address].structlogsPerStartLine,
)

const selectActiveLineInstruction = createSelector(
  [selectActiveLine, sourceFilesSelectors.selectSourceFileId, instructionsSelectors.selectCurrentInstructions],
  (line, fileId, instructions) => {
    return Object.values(instructions).filter(
      (instruction) => line === instruction.startCodeLine && line <= instruction.endCodeLine && fileId === instruction.fileId,
    )
  },
)

const selectStructLogsForActiveLine = createSelector(
  [
    selectActiveLine,
    sourceFilesSelectors.selectSourceFileId,
    selectStructlogsPerLine,
    activeBlockSelectors.selectActiveBlock,
    structlogsSelectors.selectAllParsedStructLogs,
  ],
  (line, fileId, structLogsPerLine, { address }, structLogs) => {
    const currentStructLogsLineSet = structLogsPerLine[address]?.structlogsPerStartLine[fileId]?.[line]
    if (!currentStructLogsLineSet) return null

    return currentStructLogsLineSet.map((structLog) => structLogs[structLog.index]).filter((item) => Boolean(item))
  },
)

const selectStructLogsForActiveLineMappedToIndex = createSelector([selectStructLogsForActiveLine], (structLogs) => {
  if (!structLogs?.length) return {}
  return structLogs.reduce<Record<number, TStructlogWithListIndex>>((accumulator, structLog) => {
    accumulator[structLog.index] = structLog
    return accumulator
  }, {})
})

const selectCurrentSelectedSourceLineContent = createSelector(
  [sourceFilesSelectors.selectCurrentSourceFiles, selectActiveLine, sourceFilesSelectors.selectSourceFileId],
  (sourceFiles, activeLine, fileId) => {
    const currentSourceFile = sourceFiles[fileId]
    if (!currentSourceFile) return ''

    const regexForAllNewLineTypes = /\r\n|\n|\r/g
    const sourceParts = currentSourceFile.content.split(regexForAllNewLineTypes)

    return sourceParts[activeLine]
  },
)

const selectAvailableLinesForCurrentFile = createSelector(
  [sourceFilesSelectors.selectCurrentSourceFiles, sourceFilesSelectors.selectSourceFileId, selectStructlogsPerLineForActiveBlock],
  (sourceFiles, fileId, structLogsPerLine) => {
    const currentSourceFile = sourceFiles[fileId]
    if (!currentSourceFile) return []

    if (!structLogsPerLine || !structLogsPerLine[fileId]) return []

    return Object.keys(structLogsPerLine[fileId]).map((line) => Number(line))
  },
)

const selectStructlogsGroupedByIndexRange = createSelector([selectStructLogsForActiveLineMappedToIndex], (structLogs) => {
  if (!Object.keys(structLogs)) return []

  return Object.entries(structLogs).reduce<TStructlogWithListIndex[][]>((accumulator, [_, structLog]) => {
    if (accumulator.length === 0) {
      accumulator.push([structLog])
      return accumulator
    }

    const blockIndexForThisStructlog = accumulator.findIndex((block) => {
      const lastItemInBlock = block.at(-1)

      if (checkOpcodeIfOfCallGroupType(lastItemInBlock.op)) {
        return true
      }

      return block.at(-1).index + 1 === structLog.index
    })
    if (blockIndexForThisStructlog === -1) {
      accumulator.push([structLog])
      return accumulator
    }

    accumulator[blockIndexForThisStructlog].push(structLog)

    return accumulator
  }, [])
})

export const activeLineSelectors = {
  selectStructlogsPerLineForActiveBlock,
  selectStructlogsGroupedByIndexRange,
  selectStructLogsForActiveLineMappedToIndex,
  selectStructLogsForActiveLine,
  selectIsLineSelected,
  selectCurrentSelectedSourceLineContent,
  selectAvailableLinesForCurrentFile,
  selectActiveLineInstruction,
  selectActiveLine,
}
