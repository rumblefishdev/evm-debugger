import React from 'react'

import type { ButtonProps } from './Button.types'
import { StyledButton } from './styles'

export const Button = ({ big, ...props }: ButtonProps) => {
  return (
    <StyledButton
      big={big}
      {...props}
    >
      {props.children}
    </StyledButton>
  )
}
