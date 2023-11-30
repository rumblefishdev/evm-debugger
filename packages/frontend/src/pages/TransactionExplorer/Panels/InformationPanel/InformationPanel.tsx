import React from 'react'

import { StyledBigPanel, StyledHeading, StyledHeadingWrapper } from '../styles'
import { GridLayoutHandler } from '../../../../components/GridLayout'

import { MemoryInfoCard, StackInfoCard, StorageInfoCard } from './Cards'

export interface InformationPanel {
  inGridLayout?: boolean
}
export const InformationPanel: React.FC<InformationPanel> = ({ inGridLayout }): JSX.Element => (
  <StyledBigPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Step information</StyledHeading>
      <div style={{ flexGrow: 1 }} />
      {inGridLayout && <GridLayoutHandler />}
    </StyledHeadingWrapper>
    <StackInfoCard />
    <MemoryInfoCard />
    <StorageInfoCard />
  </StyledBigPanel>
)
