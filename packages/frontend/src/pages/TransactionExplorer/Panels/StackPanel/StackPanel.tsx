import React from 'react'

import { StyledPanel, StyledHeading, StyledHeadingWrapper } from '../styles'
import { StackInfoCard } from '../InformationPanel/Cards'

export const StackPanel: React.FC = () => (
  <StyledPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Stack</StyledHeading>
    </StyledHeadingWrapper>
    <StackInfoCard />
  </StyledPanel>
)
