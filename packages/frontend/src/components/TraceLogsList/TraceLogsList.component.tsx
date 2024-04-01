import React from 'react'
import { Drawer } from '@mui/material'
import type { TContractFunction } from '@evm-debuger/types'

import { Button } from '../Button'

import type { TNestedFunction, TTraceLogsListComponentProps } from './TraceLogsList.types'
import {
  StyledBar,
  StyledBarText,
  StyledTraceLogsListContainer,
  StyledHeading,
  StyledHeadingWrapper,
  StyledListWrapper,
} from './TraceLogsList.styles'
import { FunctionElementComponent } from './FunctionElement/FunctionElement.component'

const placeholderFunction = (functionStack: TContractFunction[], rootDepth: number): TNestedFunction => {
  const _rootFunction = functionStack[0]
  const innerFunctions = functionStack.slice(1).filter((func) => func.depth === rootDepth + 1)

  return {
    innerFunctions: innerFunctions.map((rootFunction) => {
      const rootFunctionIndex = functionStack.indexOf(rootFunction)
      const functionStackFromRoot = functionStack.slice(rootFunctionIndex)
      const functionStackEndIndex = [...functionStackFromRoot.slice(1)].reverse().findIndex((func) => func.depth === rootFunction.depth)

      if (rootFunction.isYul || !rootFunction.isMain) {
        return {
          innerFunctions: [],
          function: rootFunction,
        }
      }

      return placeholderFunction(functionStackFromRoot.slice(0, functionStackEndIndex), rootFunction.depth)
    }),
    function: _rootFunction,
  }
}

export const TraceLogsListComponent: React.FC<TTraceLogsListComponentProps> = ({
  activeTraceLogIndex,
  activeStructLogIndex,
  functionStack,
  activateStructLog,
  activateTraceLog,
}) => {
  const [isDrawerVisible, setDrawerVisibility] = React.useState(false)

  const toggleDrawer = () => {
    setDrawerVisibility(!isDrawerVisible)
  }

  const test = React.useMemo(() => {
    return placeholderFunction(functionStack, 0)
  }, [functionStack])

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
            {functionStack.map((functionData) => {
              return (
                <FunctionElementComponent
                  activateStructLog={activateStructLog}
                  activateTraceLog={activateTraceLog}
                  isActiveElement={activeStructLogIndex === functionData.index}
                  isActiveGroup={activeTraceLogIndex === functionData.traceLogIndex}
                  functionBody={functionData}
                  key={functionData.index}
                />
              )
            })}
          </StyledListWrapper>
        </StyledTraceLogsListContainer>
      </Drawer>
    </>
  )
}
