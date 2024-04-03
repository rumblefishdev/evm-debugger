import React from 'react'

import {
  StyledContentCopiedIcon,
  StyledContentCopyIcon,
  StyledContentWrapper,
  StyledFunctionInputParameterContainerTooltip,
  StyledFunctionSingatureParameter,
  StyledHeadingWrapper,
  StyledText,
  StyledTextWrapper,
} from './FunctionInputParameter.styles'
import type { TFunctionInputParameterComponentProps } from './FunctionInputParameter.types'

export const FunctionInputParameterComponent: React.FC<TFunctionInputParameterComponentProps> = ({
  isTooltipOpen,
  name,
  type,
  value,
  color,
  handleTooltipClose,
  handleTooltipOpen,
  shortValue,
  ...props
}) => {
  const [copiedValue, setCopiedValue] = React.useState('')

  React.useEffect(() => {
    if (copiedValue) {
      const timeout = setTimeout(() => {
        setCopiedValue('')
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [copiedValue])

  const handleCopy = (elementValue: string) => {
    navigator.clipboard.writeText(elementValue)
    setCopiedValue(elementValue)
  }

  const clickPreventPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation()

  return (
    <StyledFunctionInputParameterContainerTooltip
      open={isTooltipOpen}
      onClose={handleTooltipClose}
      onClick={handleTooltipOpen}
      PopperProps={{ onClick: clickPreventPropagation }}
      title={
        <StyledContentWrapper>
          <StyledHeadingWrapper>
            <StyledText>{`name: ${name}`}</StyledText>
            <StyledText>{`type: ${type}`}</StyledText>
          </StyledHeadingWrapper>
          {typeof value === 'object' ? (
            (value as string[]).map((val, index) => (
              <StyledTextWrapper key={index}>
                <StyledText>{`value[${index}]: ${val}`}</StyledText>
                {copiedValue === val ? <StyledContentCopiedIcon /> : <StyledContentCopyIcon onClick={() => handleCopy(val)} />}
              </StyledTextWrapper>
            ))
          ) : (
            <StyledTextWrapper>
              <StyledText>{`value: ${value}`}</StyledText>
              {copiedValue === value ? <StyledContentCopiedIcon /> : <StyledContentCopyIcon onClick={() => handleCopy(value)} />}
            </StyledTextWrapper>
          )}
        </StyledContentWrapper>
      }
      {...props}
    >
      <StyledFunctionSingatureParameter sx={{ backgroundColor: color }}>{`${name} = ${shortValue}`}</StyledFunctionSingatureParameter>
    </StyledFunctionInputParameterContainerTooltip>
  )
}
