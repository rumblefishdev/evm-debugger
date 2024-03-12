import React from 'react'
import { Stack } from '@mui/material'

import { TraceLogsListContainer } from '../../components/TraceLogsList'

import { BlockSummary } from './BlockSummary'
import { ContentMap } from './ContentMap'
import { StyledContentWrapper, StyledPanelsWrapper } from './styles'

export const TransactionScreen: React.FC = () => (
  <StyledContentWrapper>
    <StyledPanelsWrapper>
      <Stack flex={3}>
        <ContentMap />
      </Stack>
      <Stack flex={4}>
        <BlockSummary />
      </Stack>
    </StyledPanelsWrapper>
    <TraceLogsListContainer />
  </StyledContentWrapper>
)
