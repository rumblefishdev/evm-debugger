import { Typography } from '@mui/material'
import React from 'react'

import { StructlogsList } from '../../components/StructlogsList'
import { useTypedSelector } from '../../store/storeHooks'

import { BytecodePanel, StructlogPanel, InformationPanel } from './Panels'
import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper } from './styles'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  const { isContract } = useTypedSelector((state) => state.activeBlock)

  if (!isContract)
    return (
      <Typography variant="headingUnknown">
        Selected Block is not a contract
      </Typography>
    )

  return (
    <>
      <StyledContentWrapper {...props}>
        <StructlogsList />
        <StructlogPanel />
        <BytecodePanel />
        <InformationPanel />
      </StyledContentWrapper>
    </>
  )
}
