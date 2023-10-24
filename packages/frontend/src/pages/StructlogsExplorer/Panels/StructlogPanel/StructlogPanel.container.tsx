import { useDispatch, useSelector } from 'react-redux'
import React, { useCallback, useEffect, useRef } from 'react'

import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { activeStructLogActions } from '../../../../store/activeStructLog/activeStructLog.slice'
import { activeSourceFileActions } from '../../../../store/activeSourceFile/activeSourceFile.slice'
import { uiActions } from '../../../../store/ui/ui.slice'

import { StructlogPanelComponent } from './StructlogPanel.component'
import type { StructlogPanelComponentRef, StructlogPanelProps } from './StructlogPanel.types'

const defaultElementHeight = 74

export const StructlogPanel: React.FC<StructlogPanelProps> = ({ isSourceView }) => {
  const dispatch = useDispatch()
  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const activeIndex = useSelector(activeStructLogSelectors.selectIndex)
  const nextIndex = useSelector(activeStructLogSelectors.selectNextIndex)
  const previousIndex = useSelector(activeStructLogSelectors.selectPreviousIndex)
  const currentInstructions = useSelector(instructionsSelectors.selectCurrentInstructions)

  const lastSourceViewValue = useRef(isSourceView)
  const didChangeView = lastSourceViewValue.current !== isSourceView

  const componentRefs = useRef<StructlogPanelComponentRef>(null)

  const setActiveStructlog = useCallback(
    (index: number) => {
      dispatch(activeStructLogActions.setActiveStrucLog(index))
      dispatch(activeSourceFileActions.setActiveSourceFile(currentInstructions[structLogs[index].pc].fileId))
    },
    [dispatch, currentInstructions, structLogs],
  )

  useEffect(() => {
    if (didChangeView && componentRefs.current.listRef) {
      componentRefs.current.listRef.scrollToIndex({ offset: -defaultElementHeight, index: activeIndex, behavior: 'smooth', align: 'start' })
      dispatch(uiActions.setStructLogsListOffset(defaultElementHeight))
      lastSourceViewValue.current = isSourceView
    }
  }, [activeIndex, dispatch, isSourceView, didChangeView])

  useEffect(() => {
    if (componentRefs.current && activeIndex) {
      const { listRef, wrapperRef } = componentRefs.current

      const element = document.getElementById(`explorer-list-row-${activeIndex}`)

      if (!element) {
        listRef.scrollToIndex({ offset: -defaultElementHeight, index: activeIndex, behavior: 'smooth', align: 'start' })
        dispatch(uiActions.setStructLogsListOffset(defaultElementHeight))
        return
      }

      const listOffsetTop = wrapperRef.offsetTop
      const listHeight = wrapperRef.offsetHeight
      const currentRowOffsetFromTopOfList = element.getBoundingClientRect().top - listOffsetTop
      const elementHeight = element.offsetHeight

      if (currentRowOffsetFromTopOfList > Math.abs(listHeight - elementHeight)) {
        listRef.scrollToIndex({ offset: -currentRowOffsetFromTopOfList + elementHeight, index: activeIndex })
        dispatch(uiActions.setStructLogsListOffset(currentRowOffsetFromTopOfList - elementHeight))
        return
      }

      if (currentRowOffsetFromTopOfList < elementHeight) {
        listRef.scrollToIndex({ offset: -elementHeight, index: activeIndex })
        dispatch(uiActions.setStructLogsListOffset(elementHeight))
        return
      }

      listRef.scrollToIndex({ offset: -currentRowOffsetFromTopOfList, index: activeIndex })
      dispatch(uiActions.setStructLogsListOffset(currentRowOffsetFromTopOfList))
    }
  }, [activeIndex, dispatch])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault() won't stop scrolling via arrow keys when is fired in if statement
      if (event.key === 'ArrowDown' && !event.repeat) {
        event.preventDefault()
        setActiveStructlog(nextIndex)
      }
      if (event.key === 'ArrowUp' && !event.repeat) {
        event.preventDefault()
        setActiveStructlog(previousIndex)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [nextIndex, setActiveStructlog, previousIndex, dispatch])

  return (
    <StructlogPanelComponent
      structlogs={structLogs}
      activeStructlogIndex={activeIndex}
      handleSelect={setActiveStructlog}
      ref={componentRefs}
    />
  )
}
