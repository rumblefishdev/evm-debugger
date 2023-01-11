import { useTheme } from '@mui/material'
import React, { useState } from 'react'

import arrowDownHover from '../../assets/svg/arrowDownHover.svg'
import arrowDownIdle from '../../assets/svg/arrowDownIdle.svg'

import type { MenuItemIconProps } from './MenuItemIcon.types'
import {
  StyledIcon,
  StyledIconWrapper,
  StyledStack,
  StyledTypography,
} from './styles'

export const MenuItemIcon = ({
  children,
  open,
  ...props
}: MenuItemIconProps) => {
  const [isHovered, setHover] = useState(false)
  const theme = useTheme()

  return (
    <StyledStack
      {...props}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      open={open}
    >
      <StyledTypography open={open} variant="buttonSmall">
        {children}
      </StyledTypography>
      <StyledIconWrapper>
        <StyledIcon
          src={arrowDownIdle}
          alt=""
          sx={isHovered ? {} : { opacity: 1 }}
          open={open}
        />
        <StyledIcon
          src={arrowDownHover}
          alt=""
          sx={isHovered ? { opacity: 1 } : {}}
          open={open}
        />
        {/* <StyledIcon src={arrowDownWhite} alt="" sx={open && isMobile ? { opacity: 1 } : {}} open={open} /> */}
      </StyledIconWrapper>
    </StyledStack>
  )
}
