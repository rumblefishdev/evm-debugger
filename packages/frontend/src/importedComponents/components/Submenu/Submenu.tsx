import { Drawer, useTheme } from '@mui/material'
import React from 'react'

import { isDarkOrNavy } from '../../../helpers/helpers'

import { StyledBox } from './styles'
import type { SubmenuProps } from './Submenu.types'

export const Submenu: React.FC<SubmenuProps> = ({ children, isOpen, closeMenu }) => {
  const isDarkMode: boolean = useTheme().palette.type === 'dark'
  const isNavyMode: boolean = useTheme().palette.type === 'navy'

  const useIsDarkOrNavyMode = (): boolean => {
    const theme = useTheme()
    return isDarkOrNavy(theme)
  }

  return (
    <Drawer
      anchor="top"
      open={isOpen}
      variant="temporary"
      sx={{ zIndex: 10 }}
      elevation={0}
      transitionDuration={{ exit: 350, enter: 350 }}
      onBackdropClick={closeMenu}
      PaperProps={{
        sx: (theme) => ({
          width: '100%',
          top: '97px',
          span: {
            color: useIsDarkOrNavyMode && 'white',
          },
          overflow: 'auto',
          img: {
            filter:
              useIsDarkOrNavyMode &&
              'brightness(0%) saturate(100%) invert(100%) sepia(2%) saturate(887%) hue-rotate(84deg) brightness(110%) contrast(100%)',
          },
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          background: isDarkMode ? '#0E1516' : isNavyMode ? 'transparent' : 'white',
          backdropFilter: isNavyMode ? 'blur(16px)' : '',
          [theme.breakpoints.down('md')]: {
            top: 0,
            height: '100vh',
            boxShadow: 'unset',
          },
        }),
      }}
      BackdropProps={{ sx: { background: 'rgba(0,0,0,0)' } }}
      ModalProps={{ keepMounted: true, disableScrollLock: true }}
    >
      <StyledBox>{children}</StyledBox>
    </Drawer>
  )
}
