import React from 'react'
import type { ViewportListRef } from 'react-viewport-list'
import { ViewportList } from 'react-viewport-list'
import type { IStructLog } from '@evm-debuger/types'
import { styled } from '@mui/material'

import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import {
  StyledHeading,
  StyledListWrapper,
  StyledSmallPanel,
} from '../../pages/StructlogsExplorer/Panels/styles'
import {
  loadActiveStructLog,
  selectParsedStructLogs,
} from '../../store/structlogs/structlogs.slice'

type LogsTree = {
  index: number
  parent?: LogsTree
  structLog: IStructLog
  logs: LogsTree[]
  last?: boolean
}

function createLogsTree(structLogs: IStructLog[]): LogsTree[] {
  let currentDepth = 0
  let currentLog: LogsTree | undefined

  return structLogs.map((structLog, index) => {
    const { depth } = structLog

    while (currentDepth > depth - 1) {
      if (currentLog) currentLog.last = true

      currentLog = currentLog.parent
      currentDepth -= 1
    }

    currentLog = {
      structLog,
      parent: currentLog,
      logs: [],
      index,
    }

    currentDepth += 1
    currentLog?.parent?.logs.push(currentLog)

    return currentLog
  })
}

const LogElement = styled('div')({
  height: '4rem',
  display: 'flex',
  cursor: 'pointer',
})

const Indent = styled('div')(({ theme }) => ({
  width: '1rem',
  borderLeft: `1px solid ${theme.palette.rfLinesLight}`,
}))

const OpWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  padding: '1.125rem 1.5rem 1.125rem 0.25rem',
  display: 'flex',
  ':before': {
    width: '0.75rem',
    marginLeft: '-1rem',
    height: '50%',
    display: 'block',
    content: '""',
    borderBottom: `1px solid ${theme.palette.rfLinesLight}`,
  },
  ...(isActive && { color: theme.palette.rfButton }),
}))

export const StructlogsList = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const activeLog = useTypedSelector(
    (state) => state.structLogs.activeStructLog,
  )
  const structLogs = useTypedSelector((state) => state.structLogs.structLogs)
  const parsedStructLogs = useTypedSelector(selectParsedStructLogs)

  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  const logsTree = createLogsTree(structLogs)

  const activate = (index: number) => {
    const selectedParsedLog = parsedStructLogs[index]
    if (selectedParsedLog) dispatch(loadActiveStructLog(selectedParsedLog))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).structLogs = structLogs

  return (
    <StyledSmallPanel>
      <StyledHeading>Operations depth</StyledHeading>
      <StyledListWrapper ref={ref}>
        <ViewportList
          viewportRef={ref}
          ref={listRef}
          items={logsTree.map((item, index) => ({ index, ...item }))}
          withCache={true}
        >
          {({ index, structLog: { depth, op } }) => {
            const isActive = activeLog?.index === index

            return (
              <LogElement key={index} onClick={() => activate(index)}>
                {Array.from({ length: depth }).map((_, depthIndex) => (
                  <Indent key={depthIndex} />
                ))}
                <OpWrapper isActive={isActive}>
                  {op} ({depth})
                </OpWrapper>
              </LogElement>
            )
          }}
        </ViewportList>
      </StyledListWrapper>
    </StyledSmallPanel>
  )
}
