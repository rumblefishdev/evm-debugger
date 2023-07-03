import { useTheme, Collapse } from '@mui/material'
import React from 'react'

import { isDarkOrNavy } from '../../../helpers/helpers'

import { StyledBox } from './styles'
import type { SubmenuProps } from './Submenu.types'

export const Submenu: React.FC<SubmenuProps> = ({
  children,
  isOpen,
  setUnmounted = (val: boolean) => {
    return val
  },
}) => {
  const theme = useTheme()
  const isDarkMode: boolean = theme.palette.type === 'dark'
  const isNavyMode: boolean = theme.palette.type === 'navy'
  const useIsDarkOrNavyMode = (): boolean => isDarkOrNavy(theme)

  return (
    <Collapse
      onEnter={() => setUnmounted(false)}
      onExited={() => setUnmounted(true)}
      in={isOpen}
      timeout={350}
      unmountOnExit
      sx={{
        width: '100%',

        span: {
          color: useIsDarkOrNavyMode && 'white',
        },

        img: {
          filter:
            useIsDarkOrNavyMode &&
            'brightness(0%) saturate(100%) invert(100%) sepia(2%) saturate(887%) hue-rotate(84deg) brightness(110%) contrast(100%)',
        },
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',

        background: isDarkMode ? '#0E1516' : isNavyMode ? 'transparent' : 'white',
        backdropFilter: isNavyMode ? 'blur(16px)' : '',
        '& .MuiCollapse-wrapper': {
          overflow: 'auto',
          '& .MuiCollapse-wrapperInner': {
            '& .MuiBox-root': {
              padding: '0px',
              height: 'auto',
            },
          },
        },
      }}
    >
      <StyledBox>{children}</StyledBox>
    </Collapse>
  )
}
