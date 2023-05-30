import React, { useCallback } from 'react'
import type { ViewportListRef } from 'react-viewport-list'
import { ViewportList } from 'react-viewport-list'
import { checkIfOfCallType } from '@evm-debuger/analyzer'
import { Tooltip } from '@mui/material'

import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import { StyledHeading, StyledListWrapper, StyledSmallPanel } from '../../pages/StructlogsExplorer/Panels/styles'
import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import type { TMainTraceLogsWithId } from '../../types'
import { getSignature } from '../../helpers/helpers'
import { getTraceLogErrorOutput } from '../../store/activeBlock/activeBlock.selector'
import { setActiveSourceFile } from '../../store/activeSourceFile/activeSourceFile.slice'

import { TraceLogElement, Indent, OpWrapper, StyledFailureIcon } from './styles'

export const TraceLogsList = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const activeBlock = useTypedSelector((state) => state.activeBlock)
  const traceLogs = useTypedSelector((state) => state.traceLogs)
  const contractNames = useTypedSelector((state) => state.contractNames.entities)

  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  const activate = useCallback(
    (traceLog: TMainTraceLogsWithId) => {
      dispatch(loadActiveBlock(traceLog))
      dispatch(setActiveSourceFile(0))
    },
    [dispatch],
  )
  const constructSignature = (traceLog: TMainTraceLogsWithId): string => {
    let signature = ''
    if (traceLog.type === 'CALL' && traceLog.input === '0x' && traceLog.isContract !== null)
      signature = `Send ${traceLog.value} ETH to ${traceLog.isContract ? 'SC' : 'EOA'}`
    else {
      const contractName = contractNames[traceLog.address]?.contractName
      signature = traceLog.input.slice(0, 10)
      if (checkIfOfCallType(traceLog) && traceLog.isContract) {
        const { functionFragment } = traceLog
        if (functionFragment) signature = `${contractName}.${getSignature(functionFragment)}`
      }
    }
    return signature
  }
  return (
    <StyledSmallPanel>
      <StyledHeading>Trace</StyledHeading>
      <StyledListWrapper ref={ref}>
        <ViewportList
          viewportRef={ref}
          ref={listRef}
          items={traceLogs}
          withCache={true}
        >
          {(traceLog) => {
            const { index, depth, type, isReverted } = traceLog
            const isActive = activeBlock?.index === index
            const signature = constructSignature(traceLog) // sighash
            return (
              <TraceLogElement
                key={index}
                onClick={() => activate(traceLog)}
              >
                {Array.from({ length: depth }).map((_, depthIndex) => (
                  <Indent key={depthIndex} />
                ))}
                <OpWrapper isActive={isActive}>
                  {isReverted && (
                    <Tooltip
                      title={getTraceLogErrorOutput(traceLog)}
                      followCursor
                    >
                      <StyledFailureIcon>❌</StyledFailureIcon>
                    </Tooltip>
                  )}
                  {`${type} ${signature}`}
                </OpWrapper>
              </TraceLogElement>
            )
          }}
        </ViewportList>
      </StyledListWrapper>
    </StyledSmallPanel>
  )
}
