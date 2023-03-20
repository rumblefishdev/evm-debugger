import React from 'react'

import { TraceLogsList } from '../../components/TraceLogsList'

import { BlockSummary } from './BlockSummary'
import { ContentMap } from './ContentMap'

export const TranscationScreen: React.FC = () => (
  <>
    <TraceLogsList />
    <ContentMap />
    <BlockSummary />
  </>
)
