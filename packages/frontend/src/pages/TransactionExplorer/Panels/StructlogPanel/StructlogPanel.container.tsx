import { useDispatch, useSelector } from 'react-redux'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { SourceFileType } from '@evm-debuger/types'

import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { activeStructLogActions } from '../../../../store/activeStructLog/activeStructLog.slice'
import { uiActions } from '../../../../store/ui/ui.slice'
import { activeLineActions } from '../../../../store/activeLine/activeLine.slice'
import { sourceFilesActions } from '../../../../store/sourceFiles/sourceFiles.slice'
import { disassembledBytecodesSelectors } from '../../../../store/disassembledBytecodes/disassembledBytecodes.selectors'
import { activeBlockActions } from '../../../../store/activeBlock/activeBlock.slice'
import { traceLogsSelectors } from '../../../../store/traceLogs/traceLogs.selectors'
import type { IExtendedStructLog } from '../../../../types'

import { StructlogPanelComponent } from './StructlogPanel.component'
import type { StructlogPanelComponentRef } from './StructlogPanel.types'

const DEFAULT_ELEMENT_HEIGHT = 74

export const StructlogPanel: React.FC = () => {
  const dispatch = useDispatch()
  const structLogs = useSelector(structlogsSelectors.selectAllParsedStructLogs)
  const traceLogs = useSelector(traceLogsSelectors.selectEntities)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const currentDissasembledBytecode = useSelector(disassembledBytecodesSelectors.selectCurrentDissasembledBytecode)
  const currentInstructions = useSelector(instructionsSelectors.selectCurrentInstructions)

  const componentRefs = useRef<StructlogPanelComponentRef>(null)

  const structlogsArray = useMemo(() => Object.values(structLogs), [structLogs])

  const setActiveStructlog = useCallback(
    (structLog: IExtendedStructLog) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structLog.index))
      dispatch(activeBlockActions.loadActiveBlock(traceLogs[structLog.traceLogIndex]))
    },
    [dispatch, traceLogs],
  )

  useEffect(() => {
    if (!activeStructlog && structlogsArray.length > 0) {
      dispatch(activeStructLogActions.setActiveStrucLog(0))
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
    const element = document.getElementById(`explorer-list-row-${activeStructlog.index}`)

    if (!element) {
      listRef.scrollToIndex({ offset: -DEFAULT_ELEMENT_HEIGHT, index: activeStructlog.index, behavior: 'smooth', align: 'start' })
      dispatch(uiActions.setStructLogsListOffset(DEFAULT_ELEMENT_HEIGHT))
      return
    }

    const listOffsetTop = wrapperRef.getBoundingClientRect().top
    const listHeight = wrapperRef.offsetHeight
    const elementHeight = element.offsetHeight
    const currentRowOffsetFromTopOfList = Math.ceil(element.getBoundingClientRect().top - listOffsetTop)

    if (currentRowOffsetFromTopOfList + elementHeight > listHeight - elementHeight / 2) {
      const offset = currentRowOffsetFromTopOfList - elementHeight
      listRef.scrollToIndex({ offset: -offset, index: activeStructlog.index })
      dispatch(uiActions.setStructLogsListOffset(currentRowOffsetFromTopOfList - elementHeight))
      return
    }

    if (currentRowOffsetFromTopOfList < elementHeight) {
      listRef.scrollToIndex({ offset: -elementHeight, index: activeStructlog.index })
      dispatch(uiActions.setStructLogsListOffset(elementHeight))
      return
    }

    listRef.scrollToIndex({ offset: -currentRowOffsetFromTopOfList, index: activeStructlog.index })
    dispatch(uiActions.setStructLogsListOffset(currentRowOffsetFromTopOfList))
  }, [activeStructlog, dispatch, structLogs, structlogsArray])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const nextStructlog = structlogsArray[activeStructlog?.index + 1]
      const previousStructlog = structlogsArray[activeStructlog?.index - 1]
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
  }, [setActiveStructlog, dispatch, structlogsArray, activeStructlog])

  return (
    <StructlogPanelComponent
      structlogs={structlogsArray}
      activeStructlog={activeStructlog}
      disassembledBytecode={currentDissasembledBytecode}
      handleSelect={setActiveStructlog}
      ref={componentRefs}
    />
  )
}
