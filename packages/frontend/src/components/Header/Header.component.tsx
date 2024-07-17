import React from 'react'
import { Typography } from '@mui/material'

import { StyledLogo } from '../../pages/StartingScreen/DebuggerFormSection/styles'
import evmLogo from '../../assets/svg/evm.svg'
import { Section } from '../AlgaeSection'

import type { HeaderProps } from './Header.types'
import { Wrapper } from './Header.styles'

export const Header: React.FC<HeaderProps> = () => {
  return (
    <Section width="small">
      <Wrapper>
        <StyledLogo src={evmLogo} />
        <Typography variant="h4">Debugger</Typography>
      </Wrapper>
    </Section>
  )
}
