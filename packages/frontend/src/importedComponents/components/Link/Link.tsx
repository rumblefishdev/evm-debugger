import React from 'react'

import type { LinkProps } from './Link.types'
import { StyledLink } from './styles'

const fixScroll = () => {
  document.body.style.overflow = 'auto'
}

export const Link = ({ children, to, ...props }: LinkProps) => {
  // In Header component in mobileDisplayHandler function
  // Body overflow is set to hidden when mobile menu is open
  // When user close mobile menu the overflow is set back to auto
  // But when user click on link, it will change the page, menu will hide but function that set overflow to auto will not be called
  // So to prevent this we set overflow to auto when user click on link

  return (
    <StyledLink
      {...props}
      onClick={fixScroll}
      href={to}
    >
      {children}
    </StyledLink>
  )
}
