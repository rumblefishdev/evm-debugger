import { Collapse, Tooltip } from '@mui/material'
import React from 'react'
import { KeyboardArrowDown } from '@mui/icons-material'

import { FunctionInputParameter } from '../FunctionInputParameter/FunctionInputParameter.container'

import type { TFunctionEntryComponentProps } from './FunctionEntry.types'
import { FunctionEntry } from './FunctionEntry.container'
import {
  StyledContractName,
  StyledEntryVariantBox,
  StyledFunctionEntryBody,
  StyledFunctionEntryContent,
  StyledFunctionEntryLeftWrapper,
  StyledFunctionEntryWrapper,
  StyledFunctionSignature,
  StyledOpcodeBox,
  StyledRevertedBox,
  StyledVerticalLine,
} from './FunctionEntry.styles'
import { useFunctionVariants } from './FunctionEntry.hook'

export const FunctionEntryComponent: React.FC<TFunctionEntryComponentProps> = ({ functionElement, canBeExpanded, activateFunction }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const toggleExpand = React.useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const activate = React.useCallback(() => {
    activateFunction(functionElement.function?.traceLogIndex || 0, functionElement.function?.index || 0)
  }, [activateFunction, functionElement.function])

  const { entryVariant, opCodeVariant, parametersColors } = useFunctionVariants(functionElement)

  return (
    <StyledFunctionEntryWrapper>
      <StyledFunctionEntryBody>
        <StyledFunctionEntryLeftWrapper>
          {functionElement.function.isReverted && <StyledRevertedBox>!REVERTED</StyledRevertedBox>}
          <StyledOpcodeBox variant={opCodeVariant}>{functionElement.function?.op || 'NOT FOUND'}</StyledOpcodeBox>
          {entryVariant.map((variant, index) => (
            <StyledEntryVariantBox
              key={index}
              variant={variant}
            >
              {variant}
            </StyledEntryVariantBox>
          ))}
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
          <StyledFunctionSignature>
            {functionElement.function?.contraceName && <StyledContractName>{functionElement.function?.contraceName}.</StyledContractName>}

            {!functionElement.function.isMain && functionElement.function?.selector}
            {functionElement.function.isMain && `${functionElement.function?.name}(`}
          </StyledFunctionSignature>
          {functionElement.function.isMain &&
            functionElement.function.inputs.map((input, index) => (
              <FunctionInputParameter
                key={index}
                parameter={input}
                color={parametersColors[index]}
              />
            ))}
          <StyledFunctionSignature>{functionElement.function.isMain && ')'}</StyledFunctionSignature>
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
