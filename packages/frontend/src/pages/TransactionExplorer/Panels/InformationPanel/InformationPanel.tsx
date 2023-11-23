import React from 'react'

import { StyledBigPanel, StyledHeading } from '../styles'

import { MemoryInfoCard, StackInfoCard, StorageInfoCard } from './Cards'

export const InformationPanel = (): JSX.Element => (
  <StyledBigPanel>
    <StyledHeading>Step information</StyledHeading>
    <StackInfoCard />
    <MemoryInfoCard />
    <StorageInfoCard />
  </StyledBigPanel>
)
