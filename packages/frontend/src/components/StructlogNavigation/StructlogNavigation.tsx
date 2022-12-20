import { Button } from '@mui/material'
import React, { useCallback, useState } from 'react'

import { useTypedSelector } from '../../store/storeHooks'
import { BytecodeInfoCard } from '../BytecodeInfoCard'
import { MemoryInfoCard } from '../MemoryInfoCard'
import { StackInfoCard } from '../StackInfoCard'
import { StorageInfoCard } from '../StorageInfoCard'

import type { StructlogNavigationProps } from './StructlogNavigation.types'
import { StyledNavigation, StyledStack } from './styles'

type TRenderTab = 'stack' | 'memory' | 'storage' | 'bytecode'

export const StructlogNavigation = ({ ...props }: StructlogNavigationProps) => {
  const [currentTab, setCurrentTab] = useState<TRenderTab>('stack')

  const renderTab = useCallback(() => {
    switch (currentTab) {
      case 'stack': {
        return <StackInfoCard />
      }
      case 'memory': {
        return <MemoryInfoCard />
      }
      case 'storage': {
        return <StorageInfoCard />
      }
      case 'bytecode': {
        return <BytecodeInfoCard />
      }
      default: {
        return null
      }
    }
  }, [currentTab])

  return (
    <StyledStack {...props}>
      <StyledNavigation>
        <Button variant="outlined" onClick={() => setCurrentTab('stack')}>
          Stack
        </Button>
        <Button variant="outlined" onClick={() => setCurrentTab('memory')}>
          Memory
        </Button>
        <Button variant="outlined" onClick={() => setCurrentTab('storage')}>
          Storage
        </Button>
        <Button variant="outlined" onClick={() => setCurrentTab('bytecode')}>
          Bytecode
        </Button>
      </StyledNavigation>
      {renderTab()}
    </StyledStack>
  )
}
