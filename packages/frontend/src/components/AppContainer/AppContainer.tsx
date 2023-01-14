import React from 'react'

import type { AppContainerProps } from './AppContainer.types'
import { StyledContainer, StyledWrapper } from './styles'

export const AppContainer = ({
  children,
  withNavbar = false,
  ...props
}: AppContainerProps) => (
  <StyledWrapper {...props}>
    <StyledContainer withNavbar={withNavbar}>{children}</StyledContainer>
  </StyledWrapper>
)
