import React from 'react'

import { StyledBigPanel, StyledHeading, StyledHeadingWrapper } from '../styles'
import { GridLayoutHandler } from '../../../../components/GridLayout'
import { StackInfoCard } from '../InformationPanel/Cards'

export interface IStackPanel {
  inGridLayout?: boolean
}
export const StackPanel: React.FC<IStackPanel> = ({ inGridLayout }): JSX.Element => (
  <StyledBigPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Stack</StyledHeading>
      <div style={{ flexGrow: 1 }} />
      {inGridLayout && <GridLayoutHandler />}
    </StyledHeadingWrapper>
    <StackInfoCard />
  </StyledBigPanel>
)
