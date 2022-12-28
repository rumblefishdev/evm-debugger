import React from 'react'

import { BytecodeInfoCard } from '../../components/BytecodeInfoCard'
import { MemoryInfoCard } from '../../components/MemoryInfoCard'
import { Navigation } from '../../components/Navigation'
import { StackInfoCard } from '../../components/StackInfoCard'
import { StorageInfoCard } from '../../components/StorageInfoCard'
import { StructlogCard } from '../../components/StructlogCard'
import { useTypedSelector } from '../../store/storeHooks'
import { selectParsedStructLogs } from '../../store/structlogs/structlogs.slice'

import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, StyledPanelsWrapper } from './styles'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  const structLogs = useTypedSelector(selectParsedStructLogs)

  if (structLogs.length === 0) return <Navigation />

  return (
    <>
      <Navigation />
      <StyledContentWrapper {...props}>
        <StructlogCard structLogs={structLogs} />
        <StyledPanelsWrapper>
          <StackInfoCard />
          <MemoryInfoCard />
          <StorageInfoCard />
          <BytecodeInfoCard />
        </StyledPanelsWrapper>
      </StyledContentWrapper>
    </>
  )
}
