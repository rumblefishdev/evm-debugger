import { Stack, styled, Box, Typography } from '@mui/material'

import { isDarkOrNavy } from '../../../helpers/helpers'
import { MenuBoxImage } from '../MenuBoxImage'
import { MenuItemIconLink } from '../MenuItemIconLink'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(5, 0),
  overflow: 'hidden',
  justifyContent: 'space-between',
  flexFlow: 'row',
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'flex-start',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(2, 0),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0),
    overflow: 'visible',
    ...theme.mixins.flexColumnStartStart,
    height: 'auto',
  },
}))

export const StyledBlogSectionWrapper = styled(Stack)(({ theme }) => ({
  width: 'auto',
  justifyContent: 'space-between',
  flexFlow: 'row wrap',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 0, 0, 0),
  },
}))
export const StyledSectionWrapper = styled(Stack)(({ theme }) => ({
  ...theme.mixins.flexColumnStartStart,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))
export const StyledEbookSectionWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  justifyContent: 'flex-start',
  gap: theme.spacing(3),
  flexWrap: 'wrap',
  flexDirection: 'row',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0),
    margin: theme.spacing(3, 0, 3, 0),
  },
}))
export const StyledDivider = styled(Stack)(({ theme }) => ({
  width: '100%',
  opacity: 0.15,
  height: '1px',
  background: theme.palette.colorLines50,
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2),
  },
}))

export const StyledMenuBoxImage = styled(MenuBoxImage)(({ theme }) => ({
  '&:hover': {
    background: theme.palette.type === 'dark' ? '#000000b8' : theme.palette.type === 'navy' && 'rgba(255, 255, 255, 0.1);',
  },
}))

export const StyledMenuItemIconLink = styled(MenuItemIconLink)(({ theme }) => ({
  img: {
    filter:
      isDarkOrNavy(theme) &&
      'brightness(0%) saturate(100%) invert(100%) sepia(2%) saturate(887%) hue-rotate(84deg) brightness(110%) contrast(100%)',
  },
}))

export const StyledLinkWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 4),
  img: {
    filter:
      isDarkOrNavy(theme) &&
      'brightness(0%) saturate(100%) invert(100%) sepia(2%) saturate(887%) hue-rotate(84deg) brightness(110%) contrast(100%)',
  },
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(3, 0, 0, 0),
  },
}))

export const StyledMarginTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1, 0, 2, 0),
}))
