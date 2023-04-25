/* eslint-disable @typescript-eslint/naming-convention */
import { Box } from '@mui/material'
import React, { useState } from 'react'

import { Logo } from '../Logo'
import { Button } from '../Button'
import { CareersSubmenu } from '../CareersSubmenu'
import { Link } from '../Link'
import { MenuItemIcon } from '../MenuItemIcon'
import { ResourcesSubmenu } from '../ResourcesSubmenu'
import { Section } from '../Section'
import { ServicesSubmenu } from '../ServicesSubmenu'
import { Submenu } from '../Submenu'
import { MenuItem } from '../MenuItem'
import { RenderWithAlgeaTheme } from '../../utils/RenderWithAlgeaTheme'

import type { HeaderProps, IState, IView } from './Header.types'
import { StyledHeader, StyledTextContainer, StyledWrapper } from './styles'

const defaultState: IState = {
  services: false,
  resources: false,
  careers: false,
}

const DesktopView = ({ closeAll, blogs }: IView) => {
  const [servicesHover, setServicesHover] = useState(false)
  const [careersHover, setCareersHover] = useState(false)
  const [resourceHover, setResourceHover] = useState(false)

  return (
    <>
      <Box height="100px"></Box>
      <StyledHeader>
        <Section width="normal">
          <StyledWrapper
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Logo algeaTheme />
            <StyledTextContainer
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <div
                onMouseEnter={() => setServicesHover(true)}
                onMouseLeave={() => setServicesHover(false)}
              >
                <MenuItemIcon
                  onTouchStart={() => {
                    setServicesHover(!servicesHover)
                  }}
                  open={servicesHover}
                >
                  Services
                </MenuItemIcon>
              </div>
              <MenuItem to="/case-studies">Case Studies</MenuItem>
              <div
                onMouseEnter={() => setCareersHover(true)}
                onMouseLeave={() => setCareersHover(false)}
              >
                <MenuItemIcon
                  onTouchStart={() => {
                    setCareersHover(!careersHover)
                  }}
                  open={careersHover}
                >
                  Careers
                </MenuItemIcon>
              </div>
              <div
                onMouseEnter={() => setResourceHover(true)}
                onMouseLeave={() => setResourceHover(false)}
              >
                <MenuItemIcon
                  onTouchStart={() => {
                    setResourceHover(!resourceHover)
                  }}
                  open={resourceHover}
                >
                  Resources
                </MenuItemIcon>
              </div>
              <MenuItem to="/team">About us</MenuItem>
            </StyledTextContainer>
            <Link to="/contact">
              <Button
                variant="contained"
                size="medium"
              >
                Contact
              </Button>
            </Link>
          </StyledWrapper>
          <Submenu
            isOpen={servicesHover}
            closeMenu={closeAll}
            noPadding
          >
            <div
              onMouseEnter={() => setServicesHover(true)}
              onMouseLeave={() => setServicesHover(false)}
            >
              <ServicesSubmenu />
            </div>
          </Submenu>
          <Submenu
            isOpen={resourceHover}
            closeMenu={closeAll}
            noPadding
          >
            <div
              onMouseEnter={() => setResourceHover(true)}
              onMouseLeave={() => setResourceHover(false)}
            >
              <ResourcesSubmenu blogs={blogs} />
            </div>
          </Submenu>
          <Submenu
            isOpen={careersHover}
            closeMenu={closeAll}
            noPadding
          >
            <div
              onMouseEnter={() => setCareersHover(true)}
              onMouseLeave={() => setCareersHover(false)}
            >
              <CareersSubmenu />
            </div>
          </Submenu>
        </Section>
      </StyledHeader>
    </>
  )
}

export const Header = ({ blogs }: HeaderProps) => {
  const [display, setDisplay] = useState(defaultState)

  const closeAll = () => {
    setDisplay(defaultState)
  }

  return (
    <RenderWithAlgeaTheme>
      <DesktopView
        closeAll={closeAll}
        blogs={blogs}
        display={display}
      />
    </RenderWithAlgeaTheme>
  )
}
