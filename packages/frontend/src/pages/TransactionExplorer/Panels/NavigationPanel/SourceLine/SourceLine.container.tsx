import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { activeLineSelectors } from '../../../../../store/activeLine/activeLine.selectors'
import { activeLineActions } from '../../../../../store/activeLine/activeLine.slice'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'
import { activeStructLogActions } from '../../../../../store/activeStructLog/activeStructLog.slice'
import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'
import { instructionsSelectors } from '../../../../../store/instructions/instructions.selectors'
import { structlogsSelectors } from '../../../../../store/structlogs/structlogs.selectors'
import { activeSourceFileActions } from '../../../../../store/activeSourceFile/activeSourceFile.slice'

import { SourceLineComponent } from './SourceLine.component'

export const SourceLineContainer: React.FC = () => {
  const dispatch = useDispatch()

  const currentStructLogs = useSelector(activeLineSelectors.selectStructLogsForActiveLineMappedToIndex)
  const currentStructLogsByBlocks = useSelector(activeLineSelectors.selectStructlogsGroupedByIndexRange)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)

  const currentSourceLineContet = useSelector(activeLineSelectors.selectCurrentSelectedSourceLineContent)

  const currentInstructions = useSelector(instructionsSelectors.selectCurrentInstructions)
  const allStructlogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const allStructlogsArray = Object.values(allStructlogs)

  const clearSelectedLine = React.useCallback(() => {
    dispatch(activeLineActions.clearActiveLine())
  }, [dispatch])

  const nextLineCoordinates = React.useMemo(() => {
    if (currentStructLogsByBlocks.length === 0 || !activeStructlog) return {}
    const blockIndex = currentStructLogsByBlocks.findIndex((block) => block.some((structlog) => structlog.index === activeStructlog?.index))

    if (blockIndex === -1) return {}

    const lastElementListIndex = currentStructLogsByBlocks[blockIndex]?.at(-1)?.listIndex
    const nextElementInstruction = currentInstructions[allStructlogsArray[lastElementListIndex + 1]?.pc]

    return {
      startCodeLine: nextElementInstruction?.startCodeLine,
      nextStructlog: allStructlogsArray[lastElementListIndex + 1],
      fileId: nextElementInstruction?.fileId,
    }
  }, [currentStructLogsByBlocks, currentInstructions, activeStructlog, allStructlogsArray])

  const previousLineCoordinates = React.useMemo(() => {
    if (currentStructLogsByBlocks.length === 0 || !activeStructlog) return {}
    const blockIndex = currentStructLogsByBlocks.findIndex((block) => block.some((structlog) => structlog.index === activeStructlog?.index))

    if (blockIndex === -1) return {}

    const firstElementListIndex = currentStructLogsByBlocks[blockIndex]?.at(0)?.listIndex
    const previousElementInstruction = currentInstructions[allStructlogsArray[firstElementListIndex - 1]?.pc]

    return {
      startCodeLine: previousElementInstruction?.startCodeLine,
      nextStructlog: allStructlogsArray[firstElementListIndex - 1],
      fileId: previousElementInstruction?.fileId,
    }
  }, [currentStructLogsByBlocks, currentInstructions, activeStructlog, allStructlogsArray])

  const moveToPreviousAvailableLine = React.useCallback(() => {
    if (!previousLineCoordinates.startCodeLine) return
    dispatch(activeLineActions.setActiveLine({ line: previousLineCoordinates.startCodeLine }))
    dispatch(activeSourceFileActions.setActiveSourceFile(previousLineCoordinates.fileId))
    dispatch(activeStructLogActions.setActiveStrucLog(previousLineCoordinates.nextStructlog))
  }, [previousLineCoordinates, dispatch])

  const moveToNextAvailableLine = React.useCallback(() => {
    if (!nextLineCoordinates.startCodeLine) return
    dispatch(activeLineActions.setActiveLine({ line: nextLineCoordinates.startCodeLine }))
    dispatch(activeSourceFileActions.setActiveSourceFile(nextLineCoordinates.fileId))
    dispatch(activeStructLogActions.setActiveStrucLog(nextLineCoordinates.nextStructlog))
  }, [nextLineCoordinates, dispatch])

  const setActiveStructlog = React.useCallback(
    (structlog: TStructlogWithListIndex) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structlog))
    },
    [dispatch],
  )

  return (
    <SourceLineComponent
      activeStructlog={activeStructlog}
      setActiveStructlog={setActiveStructlog}
      currentStructLogsByBlocks={currentStructLogsByBlocks}
      activeLineContent={currentSourceLineContet}
      clearSelectedLine={clearSelectedLine}
      moveToNextAvailableLine={moveToNextAvailableLine}
      moveToPreviousAvailableLine={moveToPreviousAvailableLine}
      isNextLineAvailable={Boolean(nextLineCoordinates.startCodeLine)}
      isPreviousLineAvailable={Boolean(previousLineCoordinates.startCodeLine)}
      areStructLogsAvailableForCurrentLine={Boolean(Object.keys(currentStructLogs).length)}
    />
  )
}
