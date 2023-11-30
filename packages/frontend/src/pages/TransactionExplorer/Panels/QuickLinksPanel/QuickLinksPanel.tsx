import React from 'react'

import { StyledBigPanel, StyledHeading, StyledHeadingWrapper } from '../styles'
import { GridLayoutHandler } from '../../../../components/GridLayout'
import { QuickLinks } from '../StructlogPanel/QuickLinks/QuickLinks'

export interface IQuickLinksPanel {
  inGridLayout?: boolean
}
export const QuickLinksPanel: React.FC<IQuickLinksPanel> = ({ inGridLayout }): JSX.Element => (
  <StyledBigPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Quick Links</StyledHeading>
      <div style={{ flexGrow: 1 }} />
      {inGridLayout && <GridLayoutHandler />}
    </StyledHeadingWrapper>
    <QuickLinks />
  </StyledBigPanel>
)
