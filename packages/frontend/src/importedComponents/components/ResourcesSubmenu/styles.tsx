import { Stack, styled, Box, Typography } from '@mui/material'

import { MenuBoxImage } from '../MenuBoxImage'
import { MenuItemIconLink } from '../MenuItemIconLink'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(6, 0),
  justifyContent: 'space-between',
  flexFlow: 'row',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    ...theme.mixins.flexColumnStartStart,
    height: 'auto',
  },
}))

export const StyledBlogSectionWrapper = styled(Stack)(({ theme }) => ({
  width: 'auto',
  flexFlow: 'row wrap',
  alignItems: 'space-around',
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
  marginTop: theme.spacing(1),
  marginLeft: theme.spacing(2),
  justifyContent: 'space-between',
  flexFlow: 'row',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 0),
    marginTop: 'unset',
    marginLeft: 'unset',
    justifyContent: 'space-around',
  },
}))
export const StyledDivider = styled(Box)(({ theme }) => ({
  width: '1px',
  margin: theme.spacing(0, 4, 0, 0),
  height: '400px',
  background: '#E0E3E6',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    margin: 0,
    height: '1px',
  },
}))

export const StyledMenuBoxImage = styled(MenuBoxImage)(({ theme }) => ({
  '&:hover': {
    background: theme.palette.type === 'dark' ? '#000000b8' : theme.palette.type === 'navy' && 'rgba(255, 255, 255, 0.1);',
  },
  [theme.breakpoints.up('md')]: {
    margin: '4px 12px',
  },
}))

export const StyledMenuItemIconLink = styled(MenuItemIconLink)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}))

export const StyledLinkWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 4),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(3, 0),
  },
}))

export const StyledMarginTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}))
