import { Stack, styled, Typography } from '@mui/material'

import centerEllipse from '../../../assets/png/centerEllipse.png'
/* eslint sort-keys-fix/sort-keys-fix:0*/

export const CenterEllipse = styled('div')(({ theme }) => ({
  '&:before': {
    content: "''",
    height: `100%`,
    width: `100%`,
    left: '0%',
    top: '-10%',
    position: 'absolute',
    backgroundImage: `url(${centerEllipse})`,
    backgroundSize: `120% 120%, 100%, 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPositionX: `20%, 100%, 70%`,
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `auto 120%`,
      backgroundPositionX: `50%, 100%, 70%`,
      top: '-20%',
    },
    [theme.breakpoints.down('md')]: {
      backgroundSize: `auto 110%`,
      backgroundPositionX: `50%, 100%, 70%`,
      top: '-30%',
    },
  },
}))

export const Line = styled('div')(({ theme }) => ({
  height: '1px',
  width: '100%',
  backgroundColor: '#FFFFFF',
  opacity: 0.15,
  marginTop: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))

export const StyledBlocksStack = styled(Stack)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'space-evenly',
}))
export const Block = styled(Stack)(({ theme }) => ({
  width: '32%',
  display: 'flex',
  alignItems: 'flex-start',
  padding: theme.spacing(5),
  backdropFilter: 'blur(12px)',
  borderRadius: '8px',
  background:
    ' radial-gradient(47.45% 48.31% at -0.77% 0%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%) , rgba(255, 255, 255, 0.01)',
  [theme.breakpoints.down('md')]: {
    width: '48%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(5),
  margin: theme.spacing(0, 0, 8, 0),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(6, 0, 0, 0),
    gap: theme.spacing(4),
  },
}))

export const StyledBlocksText = styled(Typography)(({ theme }) => ({
  fontWeight: '650',
  lineHeight: '30px',
  fontSize: '24px',
  letterSpacing: '-1%',
  textAlign: 'left',
  slant: 0,
  color: '#FFFFFF',

  [theme.breakpoints.down('sm')]: {
    lineHeight: '30px',
    fontSize: '24px',
    textAlign: 'center',
  },
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  background: '-webkit-linear-gradient(45deg, #FFFFFF 100%, #D9D9D9 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: '700',
  lineHeight: '64px',
  fontSize: '64px',
  letterSpacing: '-2%',
  textAlign: 'center',
  backgroundClip: 'text',
  zIndex: 10,
  margin: theme.spacing(0, 0, 5, 0),

  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(0, 0, 1, 0),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
    lineHeight: '36.8px',
  },
}))

export const StyledDescription = styled(Typography)(({ theme }) => ({
  zIndex: 1,
  color: '#FFFFFF',
  fontWeight: '700',
  lineHeight: '27.6px',
  fontSize: '22px',
  textAlign: 'center',
  letterSpacing: '-2%',

  [theme.breakpoints.down('sm')]: {
    lineHeight: '27.6px',
    fontSize: '20px',
  },
}))
