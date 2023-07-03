import type { StackProps } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material'

import { MenuItemIconLink } from '../MenuItemIconLink'
import { Section } from '../Section'
import { MenuItem } from '../MenuItem'

import { data } from './data.mock'
import { StyledDivider, StyledStack, StyledWrapper, StyledMenuBoxIcon, StyledLinkWrapper } from './styles'

const Link = ({ children }: React.PropsWithChildren) => {
  const theme = useTheme()

  if (theme.utilis.isMobile())
    return (
      <StyledLinkWrapper>
        <MenuItem
          sx={{ fontSize: '1rem' }}
          to="/services"
        >
          {children}
        </MenuItem>
      </StyledLinkWrapper>
    )

  return (
    <StyledLinkWrapper>
      <MenuItemIconLink to="/services">{children}</MenuItemIconLink>
    </StyledLinkWrapper>
  )
}

export const ServicesSubmenu = ({ ...props }: StackProps) => {
  return (
    <Section
      backgroundColor="unset"
      width="small"
    >
      <StyledStack {...props}>
        <Link>All Services</Link>
        <StyledDivider />
        <StyledWrapper>
          {data.map((item, index) => (
            <StyledMenuBoxIcon
              key={index}
              iconIdle={item.icon}
              iconHover={item.iconHover}
              link={item.link}
              headline={item.title}
              text={item.text}
            />
          ))}
        </StyledWrapper>
      </StyledStack>
    </Section>
  )
}
