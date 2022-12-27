import React from 'react'

import { BlockSummary } from '../../components/BlockSummary'
import { Navigation } from '../../components/Navigation'

import type { TracelogInformationProps } from './TracelogInformation.types'
import { StyledStack } from './styles'

export const TracelogInformation = ({ ...props }: TracelogInformationProps) => (
  <>
    <Navigation />
    <BlockSummary />
  </>
)
