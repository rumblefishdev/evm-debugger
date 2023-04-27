import React from 'react'

import { GAnalytics } from '../GAnalytics'

import type { AppContainerProps } from './AppContainer.types'
import { StyledContainer, StyledWrapper } from './styles'

export const AppContainer = ({ children, withNavbar = false, ...props }: AppContainerProps) => (
  <StyledWrapper {...props}>
    <GAnalytics />
    <StyledContainer withNavbar={withNavbar}>{children}</StyledContainer>
  </StyledWrapper>
)
