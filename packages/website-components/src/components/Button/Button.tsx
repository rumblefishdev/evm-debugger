import React from 'react'

import ArrowIconBlue from '../../assets/svg/arrow-right-lightblue.svg'
import ArrowIcon from '../../assets/svg/arrow-right-white.svg'

import type { ButtonProps } from './Button.types'
import { StyledButton } from './styles'

export const Button: React.FC<ButtonProps> = ({ children, variant = 'outlined', size = 'medium', icon = false, ...props }) => {
  const arrow = variant === 'contained' ? ArrowIcon : ArrowIconBlue

  return (
    <StyledButton disableRipple variant={variant} size={size} endIcon={icon ? <img src={arrow} alt="" /> : null} {...props}>
      {children}
    </StyledButton>
  )
}
