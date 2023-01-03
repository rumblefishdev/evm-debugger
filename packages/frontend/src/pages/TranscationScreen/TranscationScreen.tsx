import React from 'react'

import { BlockSummary } from '../../parts/TransactionScreen/BlockSummary'
import { ContentMap } from '../../parts/TransactionScreen/ContentMap'

export const TranscationScreen: React.FC = () => (
  <>
    <ContentMap />
    <BlockSummary />
  </>
)
