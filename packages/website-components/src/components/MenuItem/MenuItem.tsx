import React from 'react'

import { Link } from '../Link'

import type { MenuItemProps } from './MenuItem.types'
import { StyledTypography } from './styles'

export const MenuItem = ({ linkProps, to, children, ...props }: MenuItemProps) => {
  return (
    <Link to={to} {...linkProps}>
      <StyledTypography variant="buttonSmall" {...props}>
        {children}
      </StyledTypography>
    </Link>
  )
}
