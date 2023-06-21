import { Stack, styled, Typography } from '@mui/material'

import { TailProgressScreen } from '../../images'

export const StyledMainPanel = styled(Stack)(() => ({
  width: '524px',
  position: 'relative',
  paddingTop: 24,
  justifyContent: 'space-between',
  height: '100%',
  flexDirection: 'column',
}))

export const StyledHeadline = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfText,
}))
export const StyledHeadlineCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfBrandSecondary,
}))

export const StyledImage = styled('img')(() => ({
  zIndex: -1,
  width: 'auto',
  top: '220px',
  position: 'absolute',
  left: '128px',
  height: '756px',
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(12, 0, 6, 0),
  height: '100%',
  flexDirection: 'row',
  backgroundRepeat: `no-repeat`,
  backgroundPositionX: `20%, 100%, 70%`,

  backgroundImage: `url(${TailProgressScreen})`,
  // justifyContent: 'center',
  // alignItems: 'center',
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
    margin: theme.spacing(7, 0, 2, 0),
  },
}))
