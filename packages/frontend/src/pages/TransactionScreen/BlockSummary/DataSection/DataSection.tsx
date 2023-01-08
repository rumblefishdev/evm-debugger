import React from 'react'

import type { DataSectionProps } from './DataSection.types'
import { StyledHeaderWrapper, StyledSectionHeader, StyledStack, StyledFunctionsignature, StyledContentWrapper } from './styles'

export const DataSection = ({ subtitle, title, children, ...props }: DataSectionProps) => (
  <StyledStack {...props}>
    <StyledHeaderWrapper>
      <StyledSectionHeader>{title}</StyledSectionHeader>
      {subtitle && <StyledFunctionsignature>{subtitle}</StyledFunctionsignature>}
    </StyledHeaderWrapper>
    <StyledContentWrapper>{children}</StyledContentWrapper>
  </StyledStack>
)
