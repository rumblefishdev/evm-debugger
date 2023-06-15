import { Box, Collapse, Stack, styled } from '@mui/material'

import { MenuItem } from '../MenuItem'
import { MenuItemIcon } from '../MenuItemIcon'
/* eslint sort-keys-fix/sort-keys-fix:0*/
export const StyledHeader = styled(Box)<{ background?: string }>(({ theme, background }) => ({
  width: '100%',
  position: 'fixed',
  zIndex: 1000,
  top: 0,
  left: 0,
  background: background ?? theme.palette.colorWhite,
  backdropFilter: theme.palette.type === 'navy' ? 'blur(16px)' : '',
}))
export const StyledTextContainer = styled(Stack)(({ theme }) => ({
  width: '55%',
  'span, img': {
    filter:
      theme.palette.type === 'dark' || theme.palette.type === 'navy'
        ? 'brightness(0) saturate(100%) invert(73%) sepia(3%) saturate(502%) hue-rotate(155deg) brightness(101%) contrast(80%)'
        : 'none',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    ...theme.mixins.flexColumnStartStart,
  },
}))
export const StyledWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  borderBottom:
    theme.palette.type === 'dark' || theme.palette.type === 'navy' ? 'none' : `1px solid ${theme.palette.colorBackground?.dark}`,
}))

export const StyledImg = styled(`img`)(() => ({
  transition: 'all 0.2s ease-in-out',
  transform: 'scale(0.4)',
  opacity: 0,
  position: 'absolute',
  margin: 'auto',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
}))
export const StyledCollapse = styled(Collapse)(({ theme }) => ({
  width: '100%',
  background: theme.palette.type === 'navy' ? 'transparent' : theme.palette.colorBackground?.light,
}))
export const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: '1rem',
}))
export const StyledMenuItemIcon = styled(MenuItemIcon)(({ theme }) => ({
  ...theme.mixins.mobilePadding('16px'),
}))
export const StyledButtonWrapper = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  marginTop: '24px',
  ...theme.mixins.mobilePadding(),
}))
export const StyledButtonAnimationWrapper = styled(Box)(({ theme }) => ({
  zIndex: 100,
  width: '40px',
  height: '40px',
  position: 'relative',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.colorLines50}`,
  filter:
    theme.palette.type === 'dark' || theme.palette.type === 'navy'
      ? 'brightness(0%) saturate(100%) invert(100%) sepia(2%) saturate(887%) hue-rotate(84deg) brightness(110%) contrast(100%)'
      : 'none',
}))
