import { Stack, Typography, styled, Box } from '@mui/material'

import { MenuBoxBigIcon } from '../MenuBoxBigIcon'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(6, 0),
  justifyContent: 'space-between',
  flexFlow: 'row nowrap',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    ...theme.mixins.flexColumnStartStart,
  },
}))
export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '80%',
  justifyContent: 'space-between',
  flexFlow: 'row wrap',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    ...theme.mixins.flexColumnStartStart,
  },
}))
export const StyledText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.colorGrey?.primary,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 0),
    margin: 'unset',
    fontSize: '1rem',
  },
}))
export const StyledDivider = styled(Box)(({ theme }) => ({
  width: '1px',
  margin: theme.spacing(1, 0, 0, 8),
  height: '100px',
  background: '#E0E3E6',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    margin: 0,
    height: '1px',
  },
}))
export const StyledMenuBoxBigIcon = styled(MenuBoxBigIcon)(({ theme }) => ({
  margin: theme.spacing(0, 0, 1, 3),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(2, 0),
  },
}))