import React from 'react'

import { BlockSummary } from '../../components/BlockSummary'
import { ContentMap } from '../../components/ContentMap'

import { StyledWrapper } from './styles'

export const TranscationScreen: React.FC = () => (
  <>
    <StyledWrapper>
      <ContentMap />
      <BlockSummary />
    </StyledWrapper>
  </>
)
