import React, { useCallback } from 'react'
import type { ViewportListRef } from 'react-viewport-list'
import { ViewportList } from 'react-viewport-list'
import { checkIfOfCallType } from '@evm-debuger/analyzer'
import { Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'

import { useTypedDispatch } from '../../store/storeHooks'
import { getSignature } from '../../helpers/helpers'
import { activeSourceFileActions } from '../../store/activeSourceFile/activeSourceFile.slice'
import { activeBlockSelectors, getTraceLogErrorOutput } from '../../store/activeBlock/activeBlock.selector'
import type { TMainTraceLogsWithId } from '../../store/traceLogs/traceLogs.types'
import { traceLogsSelectors } from '../../store/traceLogs/traceLogs.selectors'
import { activeBlockActions } from '../../store/activeBlock/activeBlock.slice'
import { contractNamesSelectors } from '../../store/contractNames/contractNames.selectors'
import { activeStructLogActions } from '../../store/activeStructLog/activeStructLog.slice'

import {
  StyledHeading,
  StyledListWrapper,
  StyledSmallPanel,
  StyledHeadingWrapper,
  TraceLogElement,
  Indent,
  OpWrapper,
  StyledFailureIcon,
} from './styles'

export const TraceLogsList = (): JSX.Element => {
  const dispatch = useTypedDispatch()
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const traceLogs = useSelector(traceLogsSelectors.selectAll)
  const contractNames = useSelector(contractNamesSelectors.selectAll)

  const ref = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<ViewportListRef>(null)

  const activate = useCallback(
    (traceLog: TMainTraceLogsWithId) => {
      dispatch(activeBlockActions.loadActiveBlock(traceLog))
      dispatch(activeSourceFileActions.setActiveSourceFile(0))
      dispatch(activeStructLogActions.setActiveStrucLog(null))
    },
    [dispatch],
  )

  const constructSignature = (traceLog: TMainTraceLogsWithId): string => {
    let signature = ''
    if (traceLog.type === 'CALL' && traceLog.input === '0x' && traceLog.isContract !== null)
      signature = `Send ${traceLog.value} ETH to ${traceLog.isContract ? 'SC' : 'EOA'}`
    else {
      const contractName = contractNames.find((item) => item.address === traceLog.address)?.contractName || traceLog.address
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
      <StyledHeadingWrapper>
        <StyledHeading>Trace</StyledHeading>
      </StyledHeadingWrapper>
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
                onTouchStart={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
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
