import { Stack, styled, Box } from '@mui/material'

import { MenuBoxIcon } from '../MenuBoxIcon'

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
export const StyledDivider = styled(Box)(({ theme }) => ({
  width: '1px',
  margin: theme.spacing(1, 0, 0, 8),
  height: '270px',
  background: '#E0E3E6',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    margin: '0 0 10px 0',
    height: '1px',
  },
}))
export const StyledLinkWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 4),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(3, 0),
  },
}))
export const StyledMenuBoxIcon = styled(MenuBoxIcon)(({ theme }) => ({
  margin: theme.spacing(0, 0, 1, 3),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(2, 0),
  },
}))
