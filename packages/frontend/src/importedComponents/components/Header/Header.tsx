import { Hidden, Stack, Box, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'

import CrossIcon from '../../assets/svg/cross.svg'
import HamburgerIcon from '../../assets/svg/hamburger.svg'
import { Logo } from '../Logo'
import { Button } from '../Button'
import { CareersSubmenu } from '../CareersSubmenu'
import { MenuItem } from '../MenuItem'
import { MenuItemIcon } from '../MenuItemIcon'
import { ResourcesSubmenu } from '../ResourcesSubmenu'
import { Section } from '../Section'
import { ServicesSubmenu } from '../ServicesSubmenu'
import { Submenu } from '../Submenu'
import { Link } from '../Link'

import type { AnimateIconProps, HeaderProps, IState, IView, TMenu } from './Header.types'
import {
  StyledHeader,
  StyledTextContainer,
  StyledWrapper,
  StyledImg,
  StyledCollapse,
  StyledMenuItem,
  StyledMenuItemIcon,
  StyledButtonWrapper,
  StyledButtonAnimationWrapper,
} from './styles'

const defaultState: IState = {
  services: false,
  resources: false,
  careers: false,
}

const AnimatedIcon = ({ displayMobile, mobileDisplayHandler }: AnimateIconProps) => {
  return (
    <StyledButtonAnimationWrapper>
      <StyledImg
        src={CrossIcon}
        onClick={mobileDisplayHandler}
        sx={displayMobile ? { transform: 'scale(1)', opacity: 1 } : {}}
      />
      <StyledImg
        src={HamburgerIcon}
        onClick={mobileDisplayHandler}
        sx={displayMobile ? {} : { transform: 'scale(1)', opacity: 1 }}
      />
    </StyledButtonAnimationWrapper>
  )
}

const MobileView = ({ displayHandler, display, closeAll, blogs, background }: IView) => {
  const [isDisplayMobile, setDisplayMobile] = useState(false)
  const mobileDisplayHandler = () => {
    if (isDisplayMobile) {
      setDisplayMobile(false)
      closeAll()
      document.body.style.overflow = 'auto'
    } else {
      setDisplayMobile(true)
      document.body.style.overflow = 'hidden'
    }
  }

  const theme = useTheme()
  const isDarkMode: boolean = theme.palette.type === 'dark'
  const isNavyMode: boolean = theme.palette.type === 'navy'
  const isNotDarkOrNavy = Boolean(!isDarkMode || !isNavyMode)
  return (
    <>
      <Box height="80px" />
      <StyledHeader background={background}>
        <Section
          width="normal"
          backgroundColor={background ?? '#fff'}
        >
          <StyledWrapper
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Logo algeaTheme />
            <Stack
              direction="row"
              spacing={2}
            >
              {isNotDarkOrNavy ? (
                <Hidden
                  implementation="css"
                  mdUp={theme.palette.type === 'navy'}
                  smDown={theme.palette.type !== 'navy'}
                >
                  <Link to="/contact">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ maxWidth: '288px' }}
                    >
                      Contact
                    </Button>
                  </Link>
                </Hidden>
              ) : (
                <Link to="/contact">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ maxWidth: '288px' }}
                  >
                    Contact
                  </Button>
                </Link>
              )}
              <AnimatedIcon
                displayMobile={isDisplayMobile}
                mobileDisplayHandler={mobileDisplayHandler}
              />
            </Stack>
          </StyledWrapper>
          <Submenu
            isOpen={isDisplayMobile}
            closeMenu={mobileDisplayHandler}
          >
            <Box height="84px" />
            <Stack
              sx={{ height: '90%' }}
              justifyContent="space-between"
            >
              <StyledTextContainer>
                <StyledMenuItemIcon
                  onClick={() => displayHandler && displayHandler('services')}
                  open={display?.services}
                >
                  Services
                </StyledMenuItemIcon>
                <StyledCollapse
                  in={display?.services}
                  timeout={500}
                  unmountOnExit
                >
                  <ServicesSubmenu />
                </StyledCollapse>
                <StyledMenuItem
                  to="/case-studies"
                  linkProps={{ sx: { ...theme.mixins.mobilePadding('16px') } }}
                >
                  Case Studies
                </StyledMenuItem>
                <StyledMenuItemIcon
                  onClick={() => displayHandler && displayHandler('careers')}
                  open={display?.careers}
                >
                  Careers
                </StyledMenuItemIcon>
                <StyledCollapse
                  in={display?.careers}
                  timeout={500}
                  unmountOnExit
                >
                  <CareersSubmenu />
                </StyledCollapse>
                <StyledMenuItemIcon
                  onClick={() => displayHandler && displayHandler('resources')}
                  open={display?.resources}
                >
                  Resources
                </StyledMenuItemIcon>
                <StyledCollapse
                  in={display?.resources}
                  timeout={500}
                  unmountOnExit
                >
                  <ResourcesSubmenu blogs={blogs} />
                </StyledCollapse>
                <StyledMenuItem
                  to="/team"
                  linkProps={{ sx: { ...theme.mixins.mobilePadding('16px') } }}
                >
                  About us
                </StyledMenuItem>
              </StyledTextContainer>
              <Hidden
                implementation="css"
                lgDown={theme.palette.type === 'navy'}
                smUp={theme.palette.type !== 'navy'}
              >
                <StyledButtonWrapper>
                  <Link
                    to="/contact"
                    sx={{
                      width: '100%',
                      maxWidth: '288px',
                      marginBottom: '24px',
                    }}
                  >
                    <Button
                      variant="contained"
                      size="medium"
                      sx={{ width: '100%', maxWidth: '288px' }}
                    >
                      Contact
                    </Button>
                  </Link>
                </StyledButtonWrapper>
              </Hidden>
            </Stack>
          </Submenu>
        </Section>
      </StyledHeader>
    </>
  )
}

const DesktopView = ({ closeAll, blogs, background }: IView) => {
  const [isServicesHover, setServicesHover] = useState(false)
  const [isCareersHover, setCareersHover] = useState(false)
  const [isResourceHover, setResourceHover] = useState(false)

  return (
    <>
      <Box height="100px"></Box>
      <StyledHeader background={background}>
        <Section
          width="normal"
          backgroundColor={background ?? '#fff'}
        >
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
                    setServicesHover(!isServicesHover)
                  }}
                  open={isServicesHover}
                >
                  Services
                </MenuItemIcon>
              </div>
              <MenuItem to="/evm-debugger">Products</MenuItem>
              <MenuItem to="/case-studies">Case Studies</MenuItem>
              <div
                onMouseEnter={() => setCareersHover(true)}
                onMouseLeave={() => setCareersHover(false)}
              >
                <MenuItemIcon
                  onTouchStart={() => {
                    setCareersHover(!isCareersHover)
                  }}
                  open={isCareersHover}
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
                    setResourceHover(!isResourceHover)
                  }}
                  open={isResourceHover}
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
            isOpen={isServicesHover}
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
            isOpen={isResourceHover}
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
            isOpen={isCareersHover}
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

export const Header = ({ blogs, background }: HeaderProps) => {
  const theme = useTheme()
  const [display, setDisplay] = useState(defaultState)
  const [, setMobile] = useState<boolean>(false)

  useEffect(() => {
    setMobile(window.innerWidth <= theme.breakpoints.values.md)
    const handleWindowResize = () => setMobile(window.innerWidth <= theme.breakpoints.values.md)
    window.addEventListener('resize', handleWindowResize)
  }, [theme.breakpoints.values.md])

  const displayHandler = (menu: TMenu) => {
    setDisplay({
      ...defaultState,
      [menu]: !display[menu],
    })
  }

  const closeAll = () => {
    setDisplay(defaultState)
  }

  return (
    <>
      <Hidden
        implementation="css"
        mdUp
      >
        <MobileView
          displayHandler={displayHandler}
          closeAll={closeAll}
          display={display}
          blogs={blogs}
          background={background}
        />
      </Hidden>
      <Hidden
        implementation="css"
        mdDown
      >
        <DesktopView
          closeAll={closeAll}
          blogs={blogs}
          display={display}
          displayHandler={displayHandler}
          background={background}
        />
      </Hidden>
    </>
  )
}
