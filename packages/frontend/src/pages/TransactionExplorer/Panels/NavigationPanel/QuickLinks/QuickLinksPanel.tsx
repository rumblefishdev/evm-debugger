import React from 'react'

import { StyledPanel, StyledHeading, StyledHeadingWrapper } from '../../styles'

import { QuickLinks } from './QuickLinks.component'

export const QuickLinksPanel: React.FC = () => (
  <StyledPanel>
    <StyledHeadingWrapper>
      <StyledHeading>Quick Links</StyledHeading>
    </StyledHeadingWrapper>
    <QuickLinks />
  </StyledPanel>
)
