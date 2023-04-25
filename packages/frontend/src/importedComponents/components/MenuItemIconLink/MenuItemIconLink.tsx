import React, { useState } from 'react'

import arrowDownHover from '../../assets/svg/arrowDownHover.svg'
import arrowDownIdle from '../../assets/svg/arrowDownIdle.svg'
import { Link } from '../Link'

import type { MenuItemIconLinkProps } from './MenuItemIconLink.types'
import { StyledIcon, StyledIconWrapper, StyledStack, StyledTypography } from './styles'

export const MenuItemIconLink = ({ to, children, noIcon, ...props }: MenuItemIconLinkProps) => {
  const [isHover, setHover] = useState(false)

  return (
    <Link to={to}>
      <StyledStack
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <StyledTypography variant="buttonSmall">{children}</StyledTypography>
        <StyledIconWrapper>
          {!noIcon && (
            <>
              <StyledIcon
                src={arrowDownHover}
                alt=""
                sx={isHover ? { opacity: 1 } : {}}
              />
              <StyledIcon
                src={arrowDownIdle}
                alt=""
                sx={isHover ? {} : { opacity: 1 }}
              />
            </>
          )}
        </StyledIconWrapper>
      </StyledStack>
    </Link>
  )
}
