import React, { useCallback } from 'react'
import { ViewportList } from 'react-viewport-list'
import { Box, Drawer, Stack, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import type { TTraceLog } from '@evm-debuger/types'
import { BaseOpcodesHex } from '@evm-debuger/types'

import { useTypedDispatch } from '../../store/storeHooks'
import { getSignature } from '../../helpers/helpers'
import { activeSourceFileActions } from '../../store/activeSourceFile/activeSourceFile.slice'
import { activeBlockSelectors, getTraceLogErrorOutput } from '../../store/activeBlock/activeBlock.selector'
import type { TMainTraceLogsWithId } from '../../store/traceLogs/traceLogs.types'
import { traceLogsSelectors } from '../../store/traceLogs/traceLogs.selectors'
import { activeBlockActions } from '../../store/activeBlock/activeBlock.slice'
import { contractNamesSelectors } from '../../store/contractNames/contractNames.selectors'
import { activeStructLogActions } from '../../store/activeStructLog/activeStructLog.slice'
import { structlogsSelectors } from '../../store/structlogs/structlogs.selectors'
import { activeLineActions } from '../../store/activeLine/activeLine.slice'
import { Button } from '../Button'

import {
  StyledHeading,
  StyledListWrapper,
  StyledSmallPanel,
  StyledHeadingWrapper,
  TraceLogElement,
  Indent,
  OpWrapper,
  StyledFailureIcon,
  StyledBar,
  StyledBarText,
} from './styles'

export const TraceLogsList: React.FC = () => {
  const dispatch = useTypedDispatch()
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const traceLogs = useSelector(traceLogsSelectors.selectAll)
  const contractNames = useSelector(contractNamesSelectors.selectAll)
  const structlogs = useSelector(structlogsSelectors.selectAllParsedStructLogs)

  const [isDrawerVisible, setDrawerVisibility] = React.useState(false)

  const ref = React.useRef<HTMLDivElement>(null)

  const toggleDrawer = () => {
    setDrawerVisibility(!isDrawerVisible)
  }

  const activate = useCallback(
    (traceLog: TMainTraceLogsWithId) => {
      dispatch(activeBlockActions.loadActiveBlock(traceLog))
      dispatch(activeSourceFileActions.setActiveSourceFile(0))
      dispatch(activeLineActions.clearActiveLine())
      dispatch(activeStructLogActions.setActiveStrucLog({ ...structlogs[traceLog.startIndex], listIndex: 0 }))
    },
    [dispatch, structlogs],
  )

  const constructSignature = (traceLog: TTraceLog): string => {
    let signature = ''
    if (BaseOpcodesHex[traceLog.op] === BaseOpcodesHex.CALL && traceLog.input === '0x' && traceLog.isContract !== null)
      signature = `Send ${traceLog.value} ETH to ${traceLog.isContract ? 'SC' : 'EOA'}`
    else {
      const contractName = contractNames.find((item) => item.address === traceLog.address)?.contractName || traceLog.address
      signature = traceLog.input.slice(0, 10)
      if (traceLog.callTypeData?.functionFragment && traceLog.isContract) {
        signature = `${contractName}.${getSignature(traceLog.callTypeData?.functionFragment)}`
      }
    }
    return signature
  }

  return (
    <>
      <StyledBar onClick={toggleDrawer}>
        <StyledBarText
          variant="buttonBig"
          color="rfPrimary"
        >
          Show Trace
        </StyledBarText>
      </StyledBar>
      <Drawer
        anchor="bottom"
        open={isDrawerVisible}
        onClose={toggleDrawer}
      >
        <StyledSmallPanel>
          <StyledHeadingWrapper>
            <StyledHeading>Trace</StyledHeading>
          </StyledHeadingWrapper>
          <StyledListWrapper ref={ref}>
            <ViewportList
              viewportRef={ref}
              items={traceLogs}
              withCache={true}
            >
              {(traceLog) => {
                const { index, depth, op, isReverted } = traceLog
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
                      {`${op} ${signature}`}
                    </OpWrapper>
                  </TraceLogElement>
                )
              }}
            </ViewportList>
          </StyledListWrapper>
        </StyledSmallPanel>
      </Drawer>
    </>
  )
}
