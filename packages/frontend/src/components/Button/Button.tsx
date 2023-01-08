import React from 'react'

import type { ButtonProps } from './Button.types'
import { StyledButton } from './styles'

export const Button = ({ big, ...props }: ButtonProps) => {
  // TODO: implement "big" as class

  return (
    <StyledButton big={big} {...props}>
      {props.children}
    </StyledButton>
  )
}
