import { Typography } from '@mui/material'
import React from 'react'

import type { ButtonProps } from './Button.types'
import { StyledButton } from './styles'

export const Button = ({ ...props }: ButtonProps) => {
  return (
    <StyledButton {...props}>
      <Typography variant="buttonSmall">{props.children}</Typography>
    </StyledButton>
  )
}
