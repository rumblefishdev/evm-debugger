import React from 'react'

import type { ButtonProps } from './Button.types'
import { StyledButton } from './styles'

export const Button = ({ big, sx = {}, ...props }: ButtonProps) => {
  return (
    <StyledButton
      big={big}
      sx={sx}
      {...props}
    >
      {props.children}
    </StyledButton>
  )
}
