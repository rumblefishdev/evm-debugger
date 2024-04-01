import { Collapse } from '@mui/material'
import React from 'react'
import { KeyboardArrowDown } from '@mui/icons-material'

import type { TFunctionEntryComponentProps } from './FunctionEntry.types'
import { FunctionEntry } from './FunctionEntry.container'
import {
  StyledFunctionEntryBody,
  StyledFunctionEntryContent,
  StyledFunctionEntryLeftWrapper,
  StyledFunctionEntryWrapper,
  StyledVerticalLine,
} from './FunctionEntry.styles'

export const FunctionEntryComponent: React.FC<TFunctionEntryComponentProps> = ({ functionElement, canBeExpanded }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const toggleExpand = React.useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  return (
    <StyledFunctionEntryWrapper>
      <StyledFunctionEntryBody>
        <StyledFunctionEntryLeftWrapper>
          <div>{functionElement.function?.op}</div>
        </StyledFunctionEntryLeftWrapper>
        {Array.from({ length: functionElement.function?.depth || 0 }).map((_, index) => (
          <StyledVerticalLine key={index} />
        ))}
        <StyledFunctionEntryContent>
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
          />
        ))}
      </Collapse>
    </StyledFunctionEntryWrapper>
  )
}
