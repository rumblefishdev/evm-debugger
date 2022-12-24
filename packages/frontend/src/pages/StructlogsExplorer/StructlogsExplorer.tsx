import React from 'react'

import { BytecodeInfoCard } from '../../components/BytecodeInfoCard'
import { MemoryInfoCard } from '../../components/MemoryInfoCard'
import { Navigation } from '../../components/Navigation'
import { StackInfoCard } from '../../components/StackInfoCard'
import { StorageInfoCard } from '../../components/StorageInfoCard'
import { StructlogCard } from '../../components/StructlogCard'

import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import {
  StyledContentWrapper,
  StyledPanelsWrapper,
  StyledStack,
} from './styles'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  return (
    <StyledStack>
      <Navigation />
      <StyledContentWrapper {...props}>
        <StructlogCard />
        <StyledPanelsWrapper>
          <StackInfoCard />
          <MemoryInfoCard />
          <StorageInfoCard />
          <BytecodeInfoCard />
        </StyledPanelsWrapper>
      </StyledContentWrapper>
    </StyledStack>
  )
}
