import { Collapse } from '@mui/material'
import React from 'react'
import { KeyboardArrowDown } from '@mui/icons-material'
import { checkOpcodeIfOfCallGroupType, checkOpcodeIfOfCreateGroupType } from '@evm-debuger/analyzer'

import type { TFunctionEntryComponentProps, TOpcodeVariants } from './FunctionEntry.types'
import { FunctionEntry } from './FunctionEntry.container'
import {
  StyledFunctionEntryBody,
  StyledFunctionEntryContent,
  StyledFunctionEntryLeftWrapper,
  StyledFunctionEntryWrapper,
  StyledOpcodeBox,
  StyledVerticalLine,
} from './FunctionEntry.styles'

export const FunctionEntryComponent: React.FC<TFunctionEntryComponentProps> = ({ functionElement, canBeExpanded, activateFunction }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const toggleExpand = React.useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const activate = React.useCallback(() => {
    activateFunction(functionElement.function?.traceLogIndex || 0, functionElement.function?.index || 0)
  }, [activateFunction, functionElement.function])

  const opCodeVariant = React.useMemo((): TOpcodeVariants => {
    if (!functionElement.function?.name) {
      return 'Missing'
    }

    if (checkOpcodeIfOfCallGroupType(functionElement.function?.op)) {
      return 'Call'
    }
    if (checkOpcodeIfOfCreateGroupType(functionElement.function?.op)) {
      return 'Create'
    }
    if (functionElement.function?.op === 'JUMPDEST') {
      return 'Jumpdest'
    }
  }, [functionElement.function])

  return (
    <StyledFunctionEntryWrapper>
      <StyledFunctionEntryBody>
        <StyledFunctionEntryLeftWrapper>
          <StyledOpcodeBox variant={opCodeVariant}>{functionElement.function?.op || 'NOT FOUND'}</StyledOpcodeBox>
        </StyledFunctionEntryLeftWrapper>
        {Array.from({ length: functionElement.function?.depth || 0 }).map((_, index) => (
          <StyledVerticalLine key={index} />
        ))}
        <StyledFunctionEntryContent onClick={activate}>
          {canBeExpanded && (
            <KeyboardArrowDown
              onClick={toggleExpand}
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                cursor: 'pointer',
              }}
            />
          )}
          {functionElement.function?.contraceName}.{functionElement.function?.name} {functionElement.function.index}
        </StyledFunctionEntryContent>
      </StyledFunctionEntryBody>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
      >
        {functionElement.innerFunctions.map((innerFunction, index) => (
          <FunctionEntry
            key={innerFunction.function?.index || index}
            functionElement={innerFunction}
            activateFunction={activateFunction}
          />
        ))}
      </Collapse>
    </StyledFunctionEntryWrapper>
  )
}
