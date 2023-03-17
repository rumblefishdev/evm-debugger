import React from 'react'

import { StructlogsList } from '../../components/StructlogsList'

import { BlockSummary } from './BlockSummary'
import { ContentMap } from './ContentMap'

export const TranscationScreen: React.FC = () => (
  <>
    <StructlogsList />
    <ContentMap />
    <BlockSummary />
  </>
)
