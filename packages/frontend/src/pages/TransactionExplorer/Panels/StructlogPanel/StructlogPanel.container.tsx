import { useDispatch, useSelector } from 'react-redux'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { SourceFileType } from '@evm-debuger/types'

import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { activeStructLogActions } from '../../../../store/activeStructLog/activeStructLog.slice'
import { uiActions } from '../../../../store/ui/ui.slice'
import { traceLogsSelectors } from '../../../../store/traceLogs/traceLogs.selectors'
import type { TStructlogWithListIndex } from '../../../../store/structlogs/structlogs.types'
import { activeLineActions } from '../../../../store/activeLine/activeLine.slice'
import { sourceFilesActions } from '../../../../store/sourceFiles/sourceFiles.slice'

import { StructlogPanelComponent } from './StructlogPanel.component'
import type { StructlogPanelComponentRef } from './StructlogPanel.types'

const DEFAULT_ELEMENT_HEIGHT = 74

export const StructlogPanel: React.FC = () => {
  const dispatch = useDispatch()
  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const traceLogs = useSelector(traceLogsSelectors.selectAll)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const currentInstructions = useSelector(instructionsSelectors.selectCurrentInstructions)

  const componentRefs = useRef<StructlogPanelComponentRef>(null)

  const structlogsArray = useMemo(() => Object.values(structLogs), [structLogs])

  const setActiveStructlog = useCallback(
    (structLog: TStructlogWithListIndex) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structLog))
    },
    [dispatch],
  )

  useEffect(() => {
    if (!activeStructlog && structlogsArray.length > 0) {
      dispatch(activeStructLogActions.setActiveStrucLog(structlogsArray[0]))
    }
  }, [activeStructlog, structlogsArray, dispatch])

  useEffect(() => {
    const currentInstruction = currentInstructions?.[activeStructlog?.pc]
    if (currentInstruction && currentInstruction.fileType !== SourceFileType.UNKNOWN) {
      dispatch(sourceFilesActions.setActiveSourceFileId(currentInstruction.fileId))
      dispatch(activeLineActions.setActiveLine({ line: currentInstruction.startCodeLine }))
    }
  }, [currentInstructions, activeStructlog, dispatch])

  useEffect(() => {
    if (!componentRefs.current || !activeStructlog) return

    const { listRef, wrapperRef } = componentRefs.current
    const element = document.getElementById(`explorer-list-row-${activeStructlog.listIndex}`)

    if (!element) {
      listRef.scrollToIndex({ offset: -DEFAULT_ELEMENT_HEIGHT, index: activeStructlog.listIndex, behavior: 'smooth', align: 'start' })
      dispatch(uiActions.setStructLogsListOffset(DEFAULT_ELEMENT_HEIGHT))
      return
    }

    const listOffsetTop = wrapperRef.getBoundingClientRect().top
    const listHeight = wrapperRef.offsetHeight
    const elementHeight = element.offsetHeight
    const currentRowOffsetFromTopOfList = Math.ceil(element.getBoundingClientRect().top - listOffsetTop)

    if (currentRowOffsetFromTopOfList + elementHeight > listHeight - elementHeight / 2) {
      const offset = currentRowOffsetFromTopOfList - elementHeight
      listRef.scrollToIndex({ offset: -offset, index: activeStructlog.listIndex })
      dispatch(uiActions.setStructLogsListOffset(currentRowOffsetFromTopOfList - elementHeight))
      return
    }

    if (currentRowOffsetFromTopOfList < elementHeight) {
      listRef.scrollToIndex({ offset: -elementHeight, index: activeStructlog.listIndex })
      dispatch(uiActions.setStructLogsListOffset(elementHeight))
      return
    }

    listRef.scrollToIndex({ offset: -currentRowOffsetFromTopOfList, index: activeStructlog.listIndex })
    dispatch(uiActions.setStructLogsListOffset(currentRowOffsetFromTopOfList))
  }, [activeStructlog, dispatch, structLogs, structlogsArray])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const nextStructlog = structlogsArray[activeStructlog?.listIndex + 1]
      const previousStructlog = structlogsArray[activeStructlog?.listIndex - 1]
      if (event.key === 'ArrowDown' && !event.repeat && nextStructlog) {
        setActiveStructlog(nextStructlog)
        event.preventDefault()
      }
      if (event.key === 'ArrowUp' && !event.repeat && previousStructlog) {
        setActiveStructlog(previousStructlog)
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setActiveStructlog, dispatch, traceLogs, structlogsArray, activeStructlog])

  return (
    <StructlogPanelComponent
      structlogs={structlogsArray}
      activeStructlogIndex={activeStructlog?.index}
      handleSelect={setActiveStructlog}
      ref={componentRefs}
    />
  )
}
