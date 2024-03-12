import React from 'react'
import { Drawer } from '@mui/material'

import { Button } from '../Button'

import type { TTraceLogsListComponentProps } from './TraceLogsList.types'
import {
  StyledBar,
  StyledBarText,
  StyledTraceLogsListContainer,
  StyledHeading,
  StyledHeadingWrapper,
  StyledListWrapper,
} from './TraceLogsList.styles'
import { TraceLogElement } from './TraceLogElement/TraceLogElement.component'

export const TraceLogsListComponent: React.FC<TTraceLogsListComponentProps> = ({
  activeTraceLogIndex,
  currentInnerFunctions,
  activateStructLog,
  activateTraceLog,
  traceLogs,
}) => {
  const [isDrawerVisible, setDrawerVisibility] = React.useState(false)

  const toggleDrawer = () => {
    setDrawerVisibility(!isDrawerVisible)
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
        <StyledTraceLogsListContainer>
          <StyledHeadingWrapper>
            <StyledHeading>Trace</StyledHeading>
            <Button
              size="small"
              onClick={toggleDrawer}
            >
              Close
            </Button>
          </StyledHeadingWrapper>
          <StyledListWrapper>
            {traceLogs.map((traceLog) => {
              const isActive = activeTraceLogIndex === traceLog.index
              return (
                <TraceLogElement
                  traceLog={traceLog}
                  isActive={isActive}
                  activateStructLog={activateStructLog}
                  activateTraceLog={activateTraceLog}
                  innerFunctions={isActive ? currentInnerFunctions : []}
                  key={traceLog.index}
                />
              )
            })}
          </StyledListWrapper>
        </StyledTraceLogsListContainer>
      </Drawer>
    </>
  )
}
