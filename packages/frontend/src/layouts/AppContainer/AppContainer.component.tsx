import React from 'react'

import { GAnalytics } from '../../components/GAnalytics'
import { GoogleTagManager } from '../../components/GAnalytics/googleTagManager'

import type { AppContainerProps } from './AppContainer.types'
import { StyledAppContainer, StyledAppWrapper } from './AppContainer.styles'

export const AppContainer: React.FC<AppContainerProps> = ({ children, withNavbar = false, ...props }) => (
  <StyledAppWrapper {...props}>
    <GAnalytics />
    <GoogleTagManager />
    <StyledAppContainer withNavbar={withNavbar}>{children}</StyledAppContainer>
  </StyledAppWrapper>
)
