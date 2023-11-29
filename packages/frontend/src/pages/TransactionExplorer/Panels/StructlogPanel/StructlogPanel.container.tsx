import { useDispatch, useSelector } from 'react-redux'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { activeStructLogActions } from '../../../../store/activeStructLog/activeStructLog.slice'
import { activeSourceFileActions } from '../../../../store/activeSourceFile/activeSourceFile.slice'
import { uiActions } from '../../../../store/ui/ui.slice'
import { activeBlockActions } from '../../../../store/activeBlock/activeBlock.slice'
import { traceLogsSelectors } from '../../../../store/traceLogs/traceLogs.selectors'

import { StructlogPanelComponent } from './StructlogPanel.component'
import type { StructlogPanelComponentRef, StructlogPanelProps } from './StructlogPanel.types'

const DEFAULT_ELEMENT_HEIGHT = 74

export const StructlogPanel: React.FC<StructlogPanelProps> = () => {
  const dispatch = useDispatch()
  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const traceLogs = useSelector(traceLogsSelectors.selectAll)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const currentInstructions = useSelector(instructionsSelectors.selectCurrentInstructions)

  const componentRefs = useRef<StructlogPanelComponentRef>(null)

  const structlogsArray = useMemo(() => Object.values(structLogs), [structLogs])

  // const previousTrace = React.useRef(null)

  const setActiveStructlog = useCallback(
    (index: number) => {
      // if (
      //   structLogs[index].op === 'CALL' ||
      //   structLogs[index].op === 'DELEGATECALL' ||
      //   structLogs[index].op === 'STATICCALL' ||
      //   structLogs[index].op === 'CREATE' ||
      //   structLogs[index].op === 'CREATE2'
      // ) {
      //   dispatch(activeBlockActions.loadActiveBlock(traceLogs.find((traceLog) => traceLog.index === structLogs[index].index)))
      //   return
      // }
      // if (structLogs[index].op === 'RETURN' || structLogs[index].op === 'REVERT') {
      //   const currentBlockArrayIndex = traceLogs.findIndex((traceLog) => traceLog.index === structlogsArray[0].index - 1)
      //   const currentBlock = traceLogs[currentBlockArrayIndex]
      //   const previousBlock = traceLogs
      //     .slice(0, currentBlockArrayIndex)
      //     .filter((trace) => trace.depth === currentBlock.depth - 1)
      //     .pop()
      //   dispatch(activeBlockActions.loadActiveBlock(previousBlock))
      //   previousTrace.current = index + 1
      //   return
      // }
      dispatch(activeStructLogActions.setActiveStrucLog(index))
    },
    [dispatch],
  )

  useEffect(() => {
    if (activeStructlog === undefined && structlogsArray.length > 0) {
      // if (previousTrace.current) {
      //   dispatch(activeStructLogActions.setActiveStrucLog(previousTrace.current))
      //   previousTrace.current = null
      //   return
      // }
      dispatch(activeStructLogActions.setActiveStrucLog(structlogsArray[0].index))
    }
  }, [activeStructlog, structlogsArray, dispatch])

  useEffect(() => {
    if (activeStructlog && currentInstructions) {
      dispatch(activeSourceFileActions.setActiveSourceFile(currentInstructions[activeStructlog.pc].fileId))
    }
  }, [currentInstructions, structLogs, activeStructlog, dispatch])

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
      event.preventDefault()
      if (event.key === 'ArrowDown' && !event.repeat && nextStructlog) {
        setActiveStructlog(nextStructlog.index)
      }
      if (event.key === 'ArrowUp' && !event.repeat && previousStructlog) {
        setActiveStructlog(previousStructlog.index)
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
