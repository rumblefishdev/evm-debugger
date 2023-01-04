import React from 'react'

import type { AppContainerProps } from './AppContainer.types'
import { StyledContainer, StyledWrapper } from './styles'

export const AppContainer = ({ children, withNavbar, ...props }: AppContainerProps) => (
  <StyledWrapper>
    <StyledContainer withNavbar>{children}</StyledContainer>
  </StyledWrapper>
)
