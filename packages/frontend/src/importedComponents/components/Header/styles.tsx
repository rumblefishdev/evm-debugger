import { Box, Collapse, Stack, styled } from '@mui/material'

import { MenuItem } from '../MenuItem'
import { MenuItemIcon } from '../MenuItemIcon'

export const StyledHeader = styled(Box)<{ background?: string }>(({ background }) => ({
  zIndex: 1000,
  width: '100%',
  top: 0,
  position: 'fixed',
  left: 0,
  flexDirection: 'column',
  display: 'flex',
  background,
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
  top: 0,
  right: 0,
  position: 'absolute',
  opacity: 0,
  margin: 'auto',
  left: 0,
  bottom: 0,
}))
export const StyledCollapse = styled(Collapse)(({ theme }) => ({
  width: '100%',
  background: theme.palette.type === 'navy' ? theme.palette.colorWhite15 : theme.palette.colorBackground?.light,
}))
export const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: '1rem',
}))
export const StyledMenuItemIcon = styled(MenuItemIcon)(({ theme }) => ({
  ...theme.mixins.mobilePadding('16px'),
}))
export const StyledButtonWrapper = styled(Stack)(({ theme }) => ({
  marginTop: '24px',
  alignItems: 'center',
  ...theme.mixins.mobilePadding(),
}))
export const StyledButtonAnimationWrapper = styled(Box)(({ theme }) => ({
  zIndex: 100,
  width: '40px',
  position: 'relative',
  height: '40px',
  filter:
    theme.palette.type === 'dark' || theme.palette.type === 'navy'
      ? 'brightness(0%) saturate(100%) invert(100%) sepia(2%) saturate(887%) hue-rotate(84deg) brightness(110%) contrast(100%)'
      : 'none',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.colorLines50}`,
}))
