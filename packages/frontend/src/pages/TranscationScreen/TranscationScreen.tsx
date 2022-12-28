import React from 'react'

import { BlockSummary } from '../../components/BlockSummary'
import { ContentMap } from '../../components/ContentMap'
import { Navigation } from '../../components/Navigation'

import { StyledWrapper } from './styles'

export const TranscationScreen: React.FC = () => (
  <>
    <Navigation />
    <StyledWrapper>
      <ContentMap />
      <BlockSummary />
    </StyledWrapper>
  </>
)
