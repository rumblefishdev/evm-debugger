import { createSelector } from '@reduxjs/toolkit'
import { checkIfOfCallType } from '@evm-debuger/analyzer'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { instructionsSelectors } from '../instructions/instructions.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { structlogsSelectors } from '../structlogs/structlogs.selectors'
import { sourceCodesSelectors } from '../sourceCodes/sourceCodes.selectors'
import { activeSourceFileSelectors } from '../activeSourceFile/activeSourceFile.selectors'
import type { TStructlogWithListIndex } from '../structlogs/structlogs.types'

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
  return structLogs.reduce<Record<number, TStructlogWithListIndex>>((accumulator, structLog) => {
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

    if (!structLogsPerLine || !structLogsPerLine[fileId]) return []

    return Object.keys(structLogsPerLine[fileId]).map((line) => Number(line))
  },
)

const selectStructlogsGroupedByIndexRange = createSelector([selectStructLogsForActiveLineMappedToIndex], (structLogs) => {
  if (!Object.keys(structLogs)) return []

  return Object.entries(structLogs).reduce<TStructlogWithListIndex[][]>((accumulator, [index, structLog]) => {
    if (accumulator.length === 0) {
      accumulator.push([structLog])
      return accumulator
    }

    const blockIndexForThisStructlog = accumulator.findIndex((block) => {
      const lastItemInBlock = block.at(-1)

      if (checkIfOfCallType(lastItemInBlock)) {
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
  selectStructlogsGroupedByIndexRange,
  selectStructLogsForActiveLineMappedToIndex,
  selectStructLogsForActiveLine,
  selectIsLineSelected,
  selectCurrentSelectedSourceLineContent,
  selectAvailableLinesForCurrentFile,
  selectActiveLineInstruction,
  selectActiveLineFileId,
  selectActiveLine,
}