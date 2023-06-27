import { Hidden } from '@mui/material'
import React, { useState } from 'react'

import { Link } from '../Link'

import type { MenuBoxIconProps } from './MenuBoxIcon.types'
import { StyledHeader, StyledStack, StyledText, StyledTextWrapper, StyledImage, StyledImageWrapper } from './styles'

export const MenuBoxIcon: React.FC<MenuBoxIconProps> = ({ iconIdle, iconHover, headline, text, link, ...props }) => {
  const [isHovered, setHover] = useState(false)

  return (
    <Link to={link}>
      <StyledStack
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...props}
      >
        <Hidden
          mdDown
          implementation="css"
        >
          <StyledImageWrapper sx={{ position: 'relative' }}>
            <StyledImage
              src={iconHover}
              alt=""
              sx={isHovered ? { opacity: 1 } : {}}
            />
            <StyledImage
              src={iconIdle}
              alt=""
              sx={isHovered ? {} : { opacity: 1 }}
            />
          </StyledImageWrapper>
        </Hidden>
        <StyledTextWrapper>
          <StyledHeader variant="buttonSmall">{headline}</StyledHeader>
          <Hidden
            mdDown
            implementation="css"
          >
            <StyledText variant="caption">{text}</StyledText>
          </Hidden>
        </StyledTextWrapper>
      </StyledStack>
    </Link>
  )
}
