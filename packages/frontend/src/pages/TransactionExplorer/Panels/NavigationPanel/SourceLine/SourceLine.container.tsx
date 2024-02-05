import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { activeLineSelectors } from '../../../../../store/activeLine/activeLine.selectors'
import { activeLineActions } from '../../../../../store/activeLine/activeLine.slice'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'
import { activeStructLogActions } from '../../../../../store/activeStructLog/activeStructLog.slice'
import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'

import { SourceLineComponent } from './SourceLine.component'

export const SourceLineContainer: React.FC = () => {
  const dispatch = useDispatch()

  const availableSourceLines = useSelector(activeLineSelectors.selectAvailableLinesForCurrentFile)
  const currentStructLogs = useSelector(activeLineSelectors.selectStructLogsForActiveLineMappedToIndex)
  const currentStructLogsByBlocks = useSelector(activeLineSelectors.selectStructlogsGroupedByIndexRange)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)

  const currentLineNumber = useSelector(activeLineSelectors.selectActiveLine)
  const currentFileId = useSelector(activeLineSelectors.selectActiveLineFileId)
  const currentSourceLineContet = useSelector(activeLineSelectors.selectCurrentSelectedSourceLineContent)

  const clearSelectedLine = React.useCallback(() => {
    dispatch(activeLineActions.clearActiveLine())
  }, [dispatch])

  const isNextLineAvailable = React.useMemo(() => {
    return [...availableSourceLines].find((lineNumber: number) => lineNumber > currentLineNumber)
  }, [availableSourceLines, currentLineNumber])

  const isPreviousLineAvailable = React.useMemo(() => {
    return [...availableSourceLines].reverse().find((lineNumber: number) => lineNumber < currentLineNumber)
  }, [availableSourceLines, currentLineNumber])

  const moveToPreviousAvailableLine = React.useCallback(() => {
    dispatch(activeLineActions.setActiveLine({ line: isPreviousLineAvailable, fileId: currentFileId }))
  }, [currentFileId, isPreviousLineAvailable, dispatch])

  const moveToNextAvailableLine = React.useCallback(() => {
    dispatch(activeLineActions.setActiveLine({ line: isNextLineAvailable, fileId: currentFileId }))
  }, [currentFileId, isNextLineAvailable, dispatch])

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
      isNextLineAvailable={Boolean(isNextLineAvailable)}
      isPreviousLineAvailable={Boolean(isPreviousLineAvailable)}
      areStructLogsAvailableForCurrentLine={Boolean(Object.keys(currentStructLogs).length)}
    />
  )
}
