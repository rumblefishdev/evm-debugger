import { Stack, styled, Typography } from '@mui/material'

import { TailProgressScreen } from '../../images'

export const StyledHeadlineCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfBrandSecondary,
}))

export const StyledContainer = styled(Stack)(({ theme }) => ({
  width: '30%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
  gap: '20px',
  flexDirection: 'column',
  display: 'flex',
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  height: '100%',
  flexDirection: 'row',
  backgroundRepeat: `no-repeat`,
  backgroundPositionX: `20%, 100%, 70%`,

  backgroundImage: `url(${TailProgressScreen})`,
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(8, 0, 4, 0),
    gap: theme.spacing(3),
    flexDirection: 'column',
    backgroundSize: '80%',
    backgroundPositionY: `70%`,
    backgroundPositionX: `30%`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
    margin: theme.spacing(0),
  },
}))
