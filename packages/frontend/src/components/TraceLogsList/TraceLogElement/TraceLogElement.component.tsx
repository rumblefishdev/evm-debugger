import React from 'react'
import { Chip, Collapse, IconButton, Stack, Tooltip } from '@mui/material'

import { getTraceLogErrorOutput } from '../../../store/activeBlock/activeBlock.selector'

import {
  StyledArrowDown,
  StyledFailureIcon,
  StyledFunctionSignature,
  StyledInnerFunctionContainer,
  StyledInnerFunctionSignature,
  StyledInnerFunctionWrapper,
  TraceLogElementContainer,
} from './TraceLogElement.styles'
import type { TTraceLogElementProps } from './TraceLogElement.types'

const stripZerosLeft = (data: string) => {
  return data.replace(/^0+/, '')
}

export const TraceLogElement: React.FC<TTraceLogElementProps> = ({
  isActive,
  traceLog,
  innerFunctions,
  activateStructLog,
  activateTraceLog,
}) => {
  const [isInnerFunctionsVisibble, setIsInnerFunctionsVisibble] = React.useState(isActive)

  React.useEffect(() => {
    setIsInnerFunctionsVisibble(isActive)
  }, [isActive])

  const toggleInnerFunctions = () => {
    setIsInnerFunctionsVisibble(!isInnerFunctionsVisibble)
  }

  const { isReverted, op, signature, depth } = traceLog
  return (
    <Stack marginLeft={depth}>
      <TraceLogElementContainer>
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={1}
          onClick={() => activateTraceLog(traceLog)}
        >
          {isReverted && (
            <Tooltip
              title={getTraceLogErrorOutput(traceLog)}
              followCursor
            >
              <StyledFailureIcon>❌</StyledFailureIcon>
            </Tooltip>
          )}
          <Chip
            size="small"
            label={op}
          />
          <StyledFunctionSignature isActive={isActive}>{signature}</StyledFunctionSignature>
          <IconButton
            size="small"
            disableRipple
            disabled={!isActive}
            onClick={toggleInnerFunctions}
          >
            <StyledArrowDown
              shouldRotate={isInnerFunctionsVisibble}
              isActive={isActive}
            />
          </IconButton>
        </Stack>
        <Collapse in={isInnerFunctionsVisibble}>
          <StyledInnerFunctionWrapper depth={depth}>
            {innerFunctions.map((item) => (
              <StyledInnerFunctionContainer
                ml={item.depth * 2}
                key={item.index}
                onClick={() => {
                  activateStructLog(item.index)
                }}
              >
                <Chip
                  size="small"
                  label={item.op}
                />
                {!item.isMain && <StyledInnerFunctionSignature>{`${item.contraceName}.${item.selector}`}</StyledInnerFunctionSignature>}
                {item.isMain && (
                  <StyledInnerFunctionSignature>{`${item.contraceName}.${item.name}(${item.inputs
                    .map((input) => `${input.name} = ${stripZerosLeft(input.value)}`)
                    .join(', ')})`}</StyledInnerFunctionSignature>
                )}
              </StyledInnerFunctionContainer>
            ))}
          </StyledInnerFunctionWrapper>
        </Collapse>
      </TraceLogElementContainer>
    </Stack>
  )
}
