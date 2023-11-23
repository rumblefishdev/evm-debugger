import React from 'react'

import { GAnalytics } from '../../components/GAnalytics'
import { GoogleTagManager } from '../../components/GAnalytics/googleTagManager'

import type { AppContainerProps } from './AppContainer.types'
import { StyledContainer, StyledWrapper } from './AppContainer.styles'

export const AppContainer: React.FC<AppContainerProps> = ({ children, withNavbar = false, ...props }) => (
  <StyledWrapper {...props}>
    <GAnalytics />
    <GoogleTagManager />
    <StyledContainer withNavbar={withNavbar}>{children}</StyledContainer>
  </StyledWrapper>
)
