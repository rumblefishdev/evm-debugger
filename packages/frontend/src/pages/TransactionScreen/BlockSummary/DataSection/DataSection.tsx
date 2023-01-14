import React from 'react'

import type { DataSectionProps } from './DataSection.types'
import {
  StyledSectionHeader,
  StyledStack,
  StyledContentWrapper,
} from './styles'

export const DataSection = ({
  title,
  children,
  ...props
}: DataSectionProps) => (
  <StyledStack {...props}>
    <StyledSectionHeader>{title}</StyledSectionHeader>
    <StyledContentWrapper>{children}</StyledContentWrapper>
  </StyledStack>
)
