import React from 'react'

import { StyledBigPanel, StyledHeading, StyledHeadingWrapper } from '../styles'
import { GridLayoutHandler } from '../../../../components/GridLayout'
import { MemoryInfoCard } from '../InformationPanel/Cards'

export interface IMemoryPanel {
  inGridLayout?: boolean
}
export const MemoryPanel: React.FC<IMemoryPanel> = ({ inGridLayout }): JSX.Element => (
  <StyledBigPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Memory</StyledHeading>
      <div style={{ flexGrow: 1 }} />
      {inGridLayout && <GridLayoutHandler />}
    </StyledHeadingWrapper>
    <MemoryInfoCard />
  </StyledBigPanel>
)
