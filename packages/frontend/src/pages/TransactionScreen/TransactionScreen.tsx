import React from 'react'

import { TraceLogsList } from '../../components/TraceLogsList'

import { BlockSummary } from './BlockSummary'
import { ContentMap } from './ContentMap'
import { StyledContentWrapper } from './styles'

export const TransactionScreen: React.FC = () => (
  <StyledContentWrapper>
    <TraceLogsList />
    <ContentMap />
    <BlockSummary />
  </StyledContentWrapper>
)
