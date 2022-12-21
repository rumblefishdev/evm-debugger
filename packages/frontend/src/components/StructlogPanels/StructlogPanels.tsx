import React, { useState } from 'react'

import { BytecodeInfoCard } from '../BytecodeInfoCard'
import { MemoryInfoCard } from '../MemoryInfoCard'
import { StackInfoCard } from '../StackInfoCard'
import { StorageInfoCard } from '../StorageInfoCard'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { StructlogPanelsProps } from './StructlogPanels.types'
import { StyledStack } from './styles'

export const StructlogPanels = ({ ...props }: StructlogPanelsProps) => {
  return (
    <StyledStack {...props}>
      <StructlogAcordionPanel text="Stack">
        <StackInfoCard />
      </StructlogAcordionPanel>
      <StructlogAcordionPanel text="Memory">
        <MemoryInfoCard />
      </StructlogAcordionPanel>
      <StructlogAcordionPanel text="Storage">
        <StorageInfoCard />
      </StructlogAcordionPanel>
      <StructlogAcordionPanel text="Bytecode">
        <BytecodeInfoCard />
      </StructlogAcordionPanel>
    </StyledStack>
  )
}
