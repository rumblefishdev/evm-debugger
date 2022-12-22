import React from 'react'

import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { BytecodeInfoCardProps } from './BytecodeInfoCard.types'
import { StyledBox } from './styles'

export const BytecodeInfoCard = ({ ...props }: BytecodeInfoCardProps) => (
  <StructlogAcordionPanel text="Bytecode">
    <StyledBox {...props}></StyledBox>
  </StructlogAcordionPanel>
)
