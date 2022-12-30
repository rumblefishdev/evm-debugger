import React from 'react'

import { BytecodePanel, StructlogPanel, InformationPanel } from '../../parts/StructlogExplorerPanels'
import { Navigation } from '../../components/Navigation'

import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper } from './styles'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  return (
    <>
      <Navigation />
      <StyledContentWrapper {...props}>
        <StructlogPanel />
        <BytecodePanel />
        <InformationPanel />
      </StyledContentWrapper>
    </>
  )
}
