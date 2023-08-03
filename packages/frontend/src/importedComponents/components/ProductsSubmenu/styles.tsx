import { Stack, styled, Typography } from '@mui/material'

import { MenuBoxImage } from '../MenuBoxImage'

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
    padding: theme.spacing(0, 0, 1, 0),
    overflow: 'visible',
    ...theme.mixins.flexColumnStartStart,
    height: 'auto',
  },
}))

export const StyledText = styled(Typography)(({ theme }) => ({
  minWidth: '75px',

  [theme.breakpoints.down(1040)]: {
    margin: theme.spacing(2, 0, 0, 0),
  },

  color: theme.palette.colorGrey?.primary,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 0, 0, 0),
    margin: 'unset',
    fontSize: '1rem',
  },
}))

export const StyledBlogSectionWrapper = styled(Stack)(({ theme }) => ({
  width: 'auto',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
  flexFlow: 'row wrap',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 0, 0, 0),
    gap: theme.spacing(1),
  },
}))
export const StyledSectionWrapper = styled(Stack)(({ theme }) => ({
  ...theme.mixins.flexColumnStartStart,
  [theme.breakpoints.down('md')]: {
    width: '100%',
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

export const StyledMarginTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1, 0, 2, 0),
}))
