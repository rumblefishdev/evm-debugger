import React, { useCallback } from 'react'
import type { ViewportListRef } from 'react-viewport-list'
import { ViewportList } from 'react-viewport-list'
import { checkIfOfCallType } from '@evm-debuger/analyzer'

import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'
import {
  StyledHeading,
  StyledListWrapper,
  StyledSmallPanel,
} from '../../pages/StructlogsExplorer/Panels/styles'
import { loadActiveBlock } from '../../store/activeBlock/activeBlock.slice'
import type { TMainTraceLogsWithId } from '../../types'
import { getSignature } from '../../helpers/helpers'

import { TraceLogElement, Indent, OpWrapper } from './styles'

export const TraceLogsList = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const activeBlock = useTypedSelector((state) => state.activeBlock)
  const traceLogs = useTypedSelector((state) => state.traceLogs)

  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  const activate = useCallback(
    (traceLog: TMainTraceLogsWithId) => dispatch(loadActiveBlock(traceLog)),
    [dispatch],
  )

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
            const { index, depth, type, input, isContract } = traceLog
            const isActive = activeBlock?.index === index
            let signature: string = input.slice(0, 10) // sighash

            if (checkIfOfCallType(traceLog) && isContract) {
              const { functionFragment } = traceLog
              if (functionFragment) signature = getSignature(functionFragment)
            }

            return (
              <TraceLogElement key={index} onClick={() => activate(traceLog)}>
                {Array.from({ length: depth }).map((_, depthIndex) => (
                  <Indent key={depthIndex} />
                ))}
                <OpWrapper isActive={isActive}>{`${type}${
                  signature && ` ${signature}`
                }`}</OpWrapper>
              </TraceLogElement>
            )
          }}
        </ViewportList>
      </StyledListWrapper>
    </StyledSmallPanel>
  )
}
