import { Stack, styled, Typography } from '@mui/material'

import chequered from '../../../assets/png/chequered.png'
/* eslint sort-keys-fix/sort-keys-fix:0*/

export const Chequered = styled('div')(({ theme }) => ({
  '&:before': {
    content: "''",
    height: `113%`,
    width: `99.24vw`,
    left: '0%',
    top: `0%`,
    position: 'absolute',
    backgroundImage: `url(${chequered})`,

    backgroundSize: `100% 65%`,
    backgroundRepeat: `no-repeat`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundPositionY: `10%, 2%`,
    [theme.breakpoints.down('xl')]: {
      width: `100vw`,
    },
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `100% 55%`,
    },
    [theme.breakpoints.down('md')]: {
      backgroundSize: `auto 70%`,
      display: 'none',
    },
  },
}))
export const StyledBlocksStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',

  '& > * + *': {
    borderLeft: '1px dashed rgba(255, 255, 255, 0.1)',
    borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
  },
  '& > div:nth-child(-n+1)': {
    borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
  },
  '& > div:nth-child(n+5)': {
    borderBottom: '0px',
  },
  '& > div:nth-child(4n+5)': {
    borderLeft: '0px',
  },
  [theme.breakpoints.down('md')]: {
    '& > div:nth-child(2n+3)': {
      borderLeft: '0px',
    },
    '& > div:nth-child(n)': {
      borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
    },
  },
}))
export const StyledIcon = styled(`img`)(() => ({
  transition: 'all 0.4s ease-in-out',
  opacity: 1,
}))
export const Block = styled(Stack)(({ theme }) => ({
  flex: '1 0 21%',
  display: 'flex',
  gap: '2rem',
  backdropFilter: 'blur(12px)',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    gap: '1rem',
    flex: '1 0 48%',
  },
}))
export const BlockIconStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {},
}))

export const Line = styled('div')(({ theme }) => ({
  height: '1px',
  width: '100%',
  backgroundColor: '#FFFFFF',
  opacity: 0.15,
  marginTop: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(6),
  },
}))

export const IconCircleStack = styled(Stack)(({ theme }) => ({
  background:
    'radial-gradient(47.45% 48.31% at -0.77% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 40%),radial-gradient(52.75% 141.29% at 0% 0%, rgba(255, 255, 255, 0.09) 0%, rgba(249, 39, 127, 0) 60%, rgba(255, 255, 255, 0) 100%),radial-gradient(58.93% 157.84% at 98.5% 10%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%),linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03))',
  borderRadius: '100%',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))
export const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(5),
  margin: theme.spacing(0, 0, 0, 0),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(6, 0, 6, 0),
    gap: theme.spacing(4),
  },
}))

export const StyledBlocksText = styled(Typography)(() => ({
  fontWeight: '350',
  lineHeight: '24px',
  fontSize: '16px',
  fontFamily: 'Inter',
  letterSpacing: '-0.1em',
  textAlign: 'center',
  opacity: 0.7,
  fontVariationSettings: 'slnt 0',
  color: '#FFFFFF',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  background: '-webkit-linear-gradient(45deg, #FFFFFF 100%, #D9D9D9 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: '700',
  lineHeight: '64.4px',
  fontSize: '56px',
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

export const NetworksStyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  width: '100%',
  gap: theme.spacing(5),
  marginTop: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(6),
  },
}))
export const CurrentsNetworksStyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(4),
    justifyContent: 'center',
  },
}))

export const NetworksHeading = styled(Typography)(() => ({
  color: '#FFFFFF',
  fontWeight: '350',
  lineHeight: '36px',
  fontSize: '24px',
  letterSpacing: '-1%',
  opacity: 0.75,
  fontVariationSettings: 'slnt 0',
  textAlign: 'center',
}))

export const NetworkName = styled(Typography)(() => ({
  fontWeight: '700',
  lineHeight: '27.6px',
  fontSize: '24px',
  letterSpacing: '-2%',
  fontFamily: 'Rajdhani',
  fontVariationSettings: 'slnt 0',
  textAlign: 'center',
}))
