import React, { useEffect } from 'react'
import type { ViewportListRef } from 'react-viewport-list'
import { ViewportList } from 'react-viewport-list'

import {
  loadPreviousStructlog,
  loadNextStructlog,
  selectParsedStructLogs,
  loadActiveStructLog,
} from '../../../store/structlogs/structlogs.slice'
import { useTypedDispatch, useTypedSelector } from '../../../store/storeHooks'
import { StyledHeading, StyledListWrapper, StyledSmallPanel } from '../styles'
import { ExplorerListRow } from '../../../components/ExplorerListRow'
import type { IExtendedStructLog } from '../../../types'

export const StructlogPanel = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const structLogs = useTypedSelector(selectParsedStructLogs)
  const activeStrucLog = useTypedSelector(
    (state) => state.structLogs.activeStructLog,
  )

  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault() won't stop scrolling via arrow keys when is fired in if statement
      event.preventDefault()
      if (event.key === 'ArrowDown' && !event.repeat)
        dispatch(loadNextStructlog(structLogs))

      if (event.key === 'ArrowUp' && !event.repeat)
        dispatch(loadPreviousStructlog(structLogs))
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, structLogs])

  useEffect(() => {
    if (!activeStrucLog) return
    const index = structLogs.findIndex(
      (structLog) => structLog.pc === activeStrucLog.pc,
    )
    if (index) listRef.current?.scrollToIndex(index)
  }, [activeStrucLog, structLogs])

  const handleClick = (structLog: IExtendedStructLog) => {
    dispatch(loadActiveStructLog(structLog))
  }

  return (
    <StyledSmallPanel>
      <StyledHeading>EVM steps</StyledHeading>
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
                key={index}
                chipValue={`gasCost: ${gasCost}`}
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
