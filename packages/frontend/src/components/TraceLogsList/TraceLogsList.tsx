import React, { useCallback } from 'react'
import { ViewportList } from 'react-viewport-list'
import { Chip, Drawer, Stack, Tooltip, Typography } from '@mui/material'
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
import { yulNodesSelectors } from '../../store/yulNodes/yulNodes.selectors'
import type { TStructlogWithListIndex } from '../../store/structlogs/structlogs.types'

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

  const test = useSelector(yulNodesSelectors.selectJumpDestStructLogs)

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

  const activateStructlog = useCallback(
    (structLog: TStructlogWithListIndex) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structLog))
    },
    [dispatch],
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

  console.log('test', test)

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
                  <Stack>
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
                    {isActive && (
                      <Stack gap={1}>
                        {test.map((item) => (
                          <Stack
                            gap={1}
                            marginLeft={1}
                            flexDirection="row"
                            key={item.structLog.index}
                            onClick={() => {
                              activateStructlog(item.structLog)
                            }}
                          >
                            <Chip
                              size="small"
                              label={item.structLog.op}
                            />
                            <Chip
                              size="small"
                              label={item.structLog.pc}
                            />
                            <Typography>{item.node.name}</Typography>
                            <Typography>
                              {`(${item.node.parameters.map((param) => param.name).join(', ')}) => ${item.node.returnVariables
                                .map((param) => param.name)
                                .join(', ')}`}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )
              }}
            </ViewportList>
          </StyledListWrapper>
        </StyledSmallPanel>
      </Drawer>
    </>
  )
}
