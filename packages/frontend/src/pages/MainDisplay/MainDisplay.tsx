import React from 'react'

import { BlockSummary } from '../../components/BlockSummary'
import { ContentMap } from '../../components/ContentMap'
import { Navigation } from '../../components/Navigation'

import type { MainDisplayProps } from './MainDisplay.types'
import { StyledContentWrapper, StyledMainDisplay } from './styles'

export const MainDisplay = ({ ...props }: MainDisplayProps) => {
  return (
    <StyledMainDisplay {...props}>
      <Navigation sx={{ alignSelf: 'center' }} />
      <StyledContentWrapper>
        <ContentMap />
        <BlockSummary />
      </StyledContentWrapper>
    </StyledMainDisplay>
  )
}
