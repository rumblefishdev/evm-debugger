import React from 'react'

import { StyledBigPanel } from '../styles'

import { MemoryInfoCard, StackInfoCard, StorageInfoCard } from './Cards'

export const InformationPanel = (): JSX.Element => (
  <StyledBigPanel>
    <StackInfoCard />
    <MemoryInfoCard />
    <StorageInfoCard />
  </StyledBigPanel>
)
