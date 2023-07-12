import { Stack, styled, Box } from '@mui/material'

import { MenuBoxIcon } from '../MenuBoxIcon'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(5, 0),
  overflow: 'hidden',
  justifyContent: 'space-between',
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'flex-start',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(2, 0),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 0),
    overflow: 'visible',
    ...theme.mixins.flexColumnStartStart,
  },
}))
export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '81%',
  justifyContent: 'space-between',
  flexFlow: 'row wrap',
  alignItems: 'flex-start',
  [theme.breakpoints.down(1040)]: {
    width: '87%',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    ...theme.mixins.flexColumnStartStart,
  },
}))
export const StyledDivider = styled(Stack)(({ theme }) => ({
  width: '1px',
  opacity: 0.15,
  margin: theme.spacing(1, 0, 0, 8),
  height: '400px',
  background: theme.palette.colorLines50,
  [theme.breakpoints.down('lg')]: {
    margin: theme.spacing(0),
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    margin: '0 0 10px 0',
    height: '1px',
  },
}))

export const StyledLinkWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 4),
  [theme.breakpoints.down(1040)]: {
    margin: theme.spacing(2, 0, 0, 0),
  },
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(3, 0, 2, 0),
  },
}))
export const StyledMenuBoxIcon = styled(MenuBoxIcon)(({ theme }) => ({
  margin: theme.spacing(0, 0, 1, 3),

  '&:hover': {
    background: theme.palette.type === 'dark' ? '#000000b8' : theme.palette.type === 'navy' && 'rgba(255, 255, 255, 0.1);',
  },
  [theme.breakpoints.down('lg')]: {
    margin: theme.spacing(0),
  },
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(2, 0),
  },
}))
