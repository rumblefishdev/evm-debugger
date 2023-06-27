import React from 'react'

import { GAnalytics } from '../GAnalytics'
import { GoogleTagManager } from '../GAnalytics/googleTagManager'

import type { AppContainerProps } from './AppContainer.types'
import { StyledContainer, StyledWrapper } from './styles'

export const AppContainer = ({ children, withNavbar = false, ...props }: AppContainerProps) => (
  <StyledWrapper {...props}>
    <GAnalytics />
    <GoogleTagManager />
    <StyledContainer withNavbar={withNavbar}>{children}</StyledContainer>
  </StyledWrapper>
)
