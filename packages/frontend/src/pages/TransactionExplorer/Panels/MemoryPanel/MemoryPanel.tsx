import React from 'react'

import { StyledPanel, StyledHeading, StyledHeadingWrapper } from '../styles'
import { MemoryInfoCard } from '../InformationPanel/Cards'

export const MemoryPanel: React.FC = () => (
  <StyledPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Memory</StyledHeading>
    </StyledHeadingWrapper>
    <MemoryInfoCard />
  </StyledPanel>
)
