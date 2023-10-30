import React from 'react'

import type { ButtonProps } from './Button.types'
import { StyledButton } from './styles'

export const Button = ({ ...props }: ButtonProps) => {
  return (
    <StyledButton
      disableElevation
      disableFocusRipple
      disableRipple
      disableTouchRipple
      {...props}
    >
      {props.children}
    </StyledButton>
  )
}
