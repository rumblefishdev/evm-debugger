import React from 'react'

import type { AppContainerProps } from './AppContainer.types'
import { StyledContainer, StyledWrapper } from './styles'

export const AppContainer = ({ children, ...props }: AppContainerProps) => (
  <StyledWrapper>
    <StyledContainer>{children}</StyledContainer>
  </StyledWrapper>
)
