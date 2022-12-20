import React from 'react'

import { Navigation } from '../../components/Navigation'
import { StructlogCard } from '../../components/StructlogCard'
import { StructlogNavigation } from '../../components/StructlogNavigation'

import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, StyledStack } from './styles'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  return (
    <StyledStack>
      <Navigation />
      <StyledContentWrapper {...props}>
        <StructlogCard />
        <StructlogNavigation />
      </StyledContentWrapper>
    </StyledStack>
  )
}
