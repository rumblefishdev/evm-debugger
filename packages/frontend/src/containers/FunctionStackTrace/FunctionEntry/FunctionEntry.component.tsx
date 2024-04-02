import { Collapse } from '@mui/material'
import React from 'react'
import { KeyboardArrowDown } from '@mui/icons-material'
import { checkOpcodeIfOfCallGroupType, checkOpcodeIfOfCreateGroupType } from '@evm-debuger/analyzer'

import type { TEntryType, TFunctionEntryComponentProps, TOpcodeVariants } from './FunctionEntry.types'
import { FunctionEntry } from './FunctionEntry.container'
import {
  StyledContractName,
  StyledEntryVariantBox,
  StyledFunctionEntryBody,
  StyledFunctionEntryContent,
  StyledFunctionEntryLeftWrapper,
  StyledFunctionEntryWrapper,
  StyledFunctionSignature,
  StyledFunctionSingatureParameter,
  StyledOpcodeBox,
  StyledRevertedBox,
  StyledVerticalLine,
} from './FunctionEntry.styles'
import { getRandomParametersColor } from './FunctionEntry.utils'

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

  const entryVariant: TEntryType[] = React.useMemo(() => {
    const entryType: TEntryType[] = []
    if (functionElement.function?.isMain) {
      entryType.push('Main')
    } else {
      entryType.push('NonMain')
    }
    if (functionElement.function?.isYul) {
      entryType.push('Yul')
    }
    return entryType
  }, [functionElement.function])

  const parametersColors = React.useMemo(() => {
    return getRandomParametersColor(functionElement.function?.inputs?.length || 0)
  }, [functionElement.function?.inputs])

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
          {functionElement.function?.contraceName && <StyledContractName>{functionElement.function?.contraceName}.</StyledContractName>}
          <StyledFunctionSignature>
            {!functionElement.function.isMain && functionElement.function?.selector}
            {functionElement.function.isMain && `${functionElement.function?.name}(`}
            {functionElement.function.isMain &&
              functionElement.function.inputs.map((input, index) => (
                <StyledFunctionSingatureParameter
                  sx={{ backgroundColor: parametersColors[index] }}
                  key={index}
                >{`${input.name} = ${input.value}`}</StyledFunctionSingatureParameter>
              ))}
            {functionElement.function.isMain && ')'}
          </StyledFunctionSignature>
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
