import React, { useEffect, useCallback, useState, useRef } from 'react'
import type { ViewportListRef } from 'react-viewport-list'
import { ViewportList } from 'react-viewport-list'
import { useSelector } from 'react-redux'

import { structLogsActions } from '../../../../store/structlogs/structlogs.slice'
import { useTypedDispatch } from '../../../../store/storeHooks'
import { StyledButton, StyledHeading, StyledListWrapper, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import type { IExtendedStructLog } from '../../../../types'
import { isInView } from '../../../../helpers/dom'
import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { activeBlockSelectors } from '../../../../store/activeBlock/activeBlock.selector'
import { activeSourceFileActions } from '../../../../store/activeSourceFile/activeSourceFile.slice'

import { QuickLinks } from './QuickLinks'

export const StructlogPanel = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const activeStrucLog = useSelector(structlogsSelectors.selectActiveStructLog)
  const instructions = useSelector(instructionsSelectors.selectEntities)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const [isQuickLinksOpen, setQuickLinksOpen] = useState(false)

  const toggleQuickLinks = useCallback(() => setQuickLinksOpen((v) => !v), [])

  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<ViewportListRef>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault() won't stop scrolling via arrow keys when is fired in if statement
      if (event.key === 'ArrowDown' && !event.repeat) {
        event.preventDefault()
        dispatch(structLogsActions.loadNextStructlog(structLogs))
      }
      if (event.key === 'ArrowUp' && !event.repeat) {
        event.preventDefault()
        dispatch(structLogsActions.loadPreviousStructlog(structLogs))
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, structLogs])

  useEffect(() => {
    if (!activeStrucLog) return

    // TODO: refactor this - laggy as hell
    const index = structLogs.findIndex((structLog) => structLog.pc === activeStrucLog.pc)
    if (typeof index === 'number') {
      const element = document.querySelector(`#structlogItem_${index}`) as HTMLElement

      if ((!element || !isInView(element)) && ref.current) {
        const { scrollTop, clientHeight } = ref.current
        const offset = index * 64

        const target = offset > scrollTop ? offset - clientHeight + 84 : offset - 20

        ref.current.scrollTo({ top: target, behavior: 'smooth' })
      }
    }
  }, [activeStrucLog, structLogs])

  const handleClick = useCallback(
    (structLog: IExtendedStructLog) => {
      dispatch(structLogsActions.loadActiveStructLog(structLog))
      dispatch(activeSourceFileActions.setActiveSourceFile(instructions[activeBlock.address]?.instructions[structLog.pc]?.fileId))
    },
    [dispatch, activeBlock.address, instructions],
  )

  return (
    <StyledSmallPanel>
      <StyledHeading>
        EVM steps
        <StyledButton
          variant="text"
          onClick={toggleQuickLinks}
        >
          Quick links
        </StyledButton>
      </StyledHeading>
      <QuickLinks
        isOpen={isQuickLinksOpen}
        selectStructLog={handleClick}
      />
      <StyledListWrapper ref={ref}>
        <ViewportList
          viewportRef={ref}
          ref={listRef}
          items={structLogs}
          withCache={true}
        >
          {(item) => {
            const { gasCost, op, pc, index } = item

            return (
              <ExplorerListRow
                id={`structlogItem_${index}`}
                key={index}
                chipValue={`gas: ${gasCost}`}
                opCode={op}
                pc={pc}
                isActive={index === activeStrucLog?.index}
                onClick={() => handleClick(item)}
              />
            )
          }}
        </ViewportList>
      </StyledListWrapper>
    </StyledSmallPanel>
  )
}
