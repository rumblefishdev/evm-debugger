import { Hidden, Stack, Box, useTheme } from '@mui/material'
import React, { useEffect, useState, useCallback, useReducer, useRef } from 'react'

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
import { SUBMENUS, submenusWhichAction } from '../../utils/SubmenusUtils'
import { MenuItemWithCollapse } from '../MenuItemWithCollapse'
import { SubmenuInsideContainer } from '../SubmenuInsideContainer'

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
import {
  reducer,
  initialState,
  doChangeCollapseUnmounted,
  doChangeHoverState,
  doSetCurrentSub,
  doSetIsUnwantedTouch,
  doOnSubmenuClose,
} from './DesktopHeaderReducer'

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
  const [collapseHeight, setCollapseHeight] = useState(0)
  const mainNavbarRef = useRef(null)
  const handleResize = useCallback(() => {
    setCollapseHeight(window.innerHeight - mainNavbarRef.current?.clientHeight)
  }, [])

  const mobileDisplayHandler = () => {
    if (isDisplayMobile) {
      setDisplayMobile(false)
      window.removeEventListener('resize', handleResize)
      closeAll()
      document.body.style.overflow = 'auto'
    } else {
      setDisplayMobile(true)
      setCollapseHeight(window.innerHeight - mainNavbarRef.current?.clientHeight)
      window.addEventListener('resize', handleResize)
      document.body.style.overflow = 'hidden'
    }
  }

  const theme = useTheme()
  const isDarkMode: boolean = theme.palette.type === 'dark'
  const isNavyMode: boolean = theme.palette.type === 'navy'
  return (
    <>
      <Box height="80px" />
      <StyledHeader
        background={background}
        sx={isDisplayMobile ? { height: '100%' } : {}}
      >
        <Section
          backDropFilter={true}
          width="normal"
          backgroundColor={background ?? '#fff'}
          heightRef={mainNavbarRef}
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
              {!isDarkMode || !isNavyMode ? (
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
        </Section>
        <Submenu
          isOpen={isDisplayMobile}
          closeMenu={mobileDisplayHandler}
        >
          <Stack
            sx={{ height: `${collapseHeight}px` }}
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
                to="/evm-debugger"
                linkProps={{ sx: { ...theme.mixins.mobilePadding('16px') } }}
              >
                Products
              </StyledMenuItem>
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
      </StyledHeader>
    </>
  )
}

const DesktopView = ({ closeAll, blogs, background }: IView) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleOnSubmenuClose = useCallback(
    (sub: SUBMENUS | null) => {
      dispatch(doOnSubmenuClose(sub))
    },
    [dispatch],
  )
  const handleCollapseUnmounted = useCallback(
    (value: boolean) => {
      dispatch(doChangeCollapseUnmounted(value))
    },
    [dispatch],
  )

  const handleUnwantedTouch = useCallback(
    (value: boolean) => {
      dispatch(doSetIsUnwantedTouch(value))
    },
    [dispatch],
  )
  const handleHoverStateChange = useCallback(
    (type: string, value: boolean) => {
      dispatch(doChangeHoverState(type, value))
    },
    [dispatch],
  )

  const handleCurrentSubChange = useCallback(
    (sub: SUBMENUS | null) => {
      dispatch(doSetCurrentSub(sub))
    },
    [dispatch],
  )

  useEffect(() => {
    if (!state.isCollapseUnmounted || !state.currentSubmenu) return
    if (state.isUnwantedTouch) {
      handleUnwantedTouch(false)

      if (state.prevSubmenu === state.currentSubmenu) handleCurrentSubChange(null)
      return
    }
    handleHoverStateChange(submenusWhichAction[state.currentSubmenu], true)
  }, [handleCurrentSubChange, handleHoverStateChange, handleUnwantedTouch, state])
  return (
    <>
      <Box height="100px"></Box>
      <StyledHeader background={background}>
        <Section
          width="normal"
          backgroundColor={background ?? '#fff'}
          backDropFilter={true}
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
              <MenuItemWithCollapse
                onSubmenuClose={handleOnSubmenuClose}
                onSubmenuChange={handleCurrentSubChange}
                state={state}
                submenu={SUBMENUS.SERVICES}
              >
                <MenuItemIcon open={state.servicesHover}>Services</MenuItemIcon>
              </MenuItemWithCollapse>

              <MenuItem to="/evm-debugger">Products</MenuItem>

              <MenuItem to="/case-studies">Case Studies</MenuItem>
              <MenuItemWithCollapse
                onSubmenuClose={handleOnSubmenuClose}
                onSubmenuChange={handleCurrentSubChange}
                state={state}
                submenu={SUBMENUS.CAREERS}
              >
                <MenuItemIcon open={state.careersHover}>Careers</MenuItemIcon>
              </MenuItemWithCollapse>
              <MenuItemWithCollapse
                onSubmenuClose={handleOnSubmenuClose}
                onSubmenuChange={handleCurrentSubChange}
                state={state}
                submenu={SUBMENUS.RESOURCES}
              >
                <MenuItemIcon open={state.resourceHover}>Resources</MenuItemIcon>
              </MenuItemWithCollapse>
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
        </Section>
        <Submenu
          isOpen={state.servicesHover}
          closeMenu={closeAll}
          noPadding
          setUnmounted={handleCollapseUnmounted}
        >
          <SubmenuInsideContainer
            onUnwantedTouch={handleUnwantedTouch}
            onHoverStateChange={handleHoverStateChange}
            submenu={SUBMENUS.SERVICES}
          >
            <ServicesSubmenu />
          </SubmenuInsideContainer>
        </Submenu>
        <Submenu
          isOpen={state.resourceHover}
          closeMenu={closeAll}
          noPadding
          setUnmounted={handleCollapseUnmounted}
        >
          <SubmenuInsideContainer
            onUnwantedTouch={handleUnwantedTouch}
            onHoverStateChange={handleHoverStateChange}
            submenu={SUBMENUS.RESOURCES}
          >
            <ResourcesSubmenu blogs={blogs} />
          </SubmenuInsideContainer>
        </Submenu>
        <Submenu
          isOpen={state.careersHover}
          closeMenu={closeAll}
          noPadding
          setUnmounted={handleCollapseUnmounted}
        >
          <SubmenuInsideContainer
            onUnwantedTouch={handleUnwantedTouch}
            onHoverStateChange={handleHoverStateChange}
            submenu={SUBMENUS.CAREERS}
          >
            <CareersSubmenu />
          </SubmenuInsideContainer>
        </Submenu>
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
