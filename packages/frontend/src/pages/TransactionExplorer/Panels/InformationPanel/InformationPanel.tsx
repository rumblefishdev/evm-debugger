import React from 'react'

import { StyledPanel, StyledHeading, StyledHeadingWrapper } from '../styles'

import { MemoryInfoCard, StackInfoCard, StorageInfoCard } from './Cards'

export const InformationPanel: React.FC = () => (
  <StyledPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Step information</StyledHeading>
    </StyledHeadingWrapper>
    <StackInfoCard />
    <MemoryInfoCard />
    <StorageInfoCard />
  </StyledPanel>
)
