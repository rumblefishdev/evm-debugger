import React from 'react'

import { ContentMap } from '../../components/ContentMap'
import { Navigation } from '../../components/Navigation'

import type { GasTreeMapProps } from './GasTreeMap.types'

export const GasTreeMap: React.FC<GasTreeMapProps> = () => (
  <>
    <Navigation />
    <ContentMap />
  </>
)
