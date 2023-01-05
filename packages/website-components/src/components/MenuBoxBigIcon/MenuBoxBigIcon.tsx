import React from 'react'

import { Link } from '../Link'

import type { MenuBoxBigIconProps } from './MenuBoxBigIcon.types'
import { StyledHeader, StyledStack, StyledText, StyledTextWrapper, StyledImage } from './styles'

export const MenuBoxBigIcon: React.FC<MenuBoxBigIconProps> = ({ headline, text, icon, to, ...props }) => {
  return (
    <Link to={to}>
      <StyledStack {...props}>
        <StyledImage src={icon} alt="" />
        <StyledTextWrapper spacing={0.5}>
          <StyledHeader variant="buttonSmall">{headline}</StyledHeader>
          <StyledText variant="caption">{text}</StyledText>
        </StyledTextWrapper>
      </StyledStack>
    </Link>
  )
}
