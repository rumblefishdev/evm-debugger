import React, { useEffect } from 'react'
import type { ViewportListRef } from 'react-viewport-list'
import { ViewportList } from 'react-viewport-list'

import {
  loadPreviousStructlog,
  loadNextStructlog,
  selectParsedStructLogs,
  loadActiveStructLog,
} from '../../../../store/structlogs/structlogs.slice'
import { useTypedDispatch, useTypedSelector } from '../../../../store/storeHooks'
import { StyledButton, StyledHeading, StyledListWrapper, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import type { IExtendedStructLog } from '../../../../types'
import { isInView } from '../../../../helpers/dom'

import { QuickLinks } from './QuickLinks'

export const StructlogPanel = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const structLogs = useTypedSelector(selectParsedStructLogs)
  const activeStrucLog = useTypedSelector((state) => state.structLogs.activeStructLog)

  const [isQuickLinksOpen, setQuickLinksOpen] = React.useState(false)

  const toggleQuickLinks = React.useCallback(() => setQuickLinksOpen((v) => !v), [])

  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault() won't stop scrolling via arrow keys when is fired in if statement
      if (event.key === 'ArrowDown' && !event.repeat) {
        event.preventDefault()
        dispatch(loadNextStructlog(structLogs))
      }
      if (event.key === 'ArrowUp' && !event.repeat) {
        event.preventDefault()
        dispatch(loadPreviousStructlog(structLogs))
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, structLogs])

  useEffect(() => {
    if (!activeStrucLog) return
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

  const handleClick = (structLog: IExtendedStructLog) => {
    dispatch(loadActiveStructLog(structLog))
  }

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
