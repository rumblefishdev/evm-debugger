import { Stack, styled, Typography } from '@mui/material'

import chequered from '../../../assets/png/chequered.png'
import waveVector from '../../../assets/png/waveVector.png'
import rightEllipse from '../../../assets/png/rightEllipse.png'
import leftEllipse from '../../../assets/png/leftEllipse.png'
/* eslint sort-keys-fix/sort-keys-fix:0*/

export const Chequered = styled('div')(({ theme }) => ({
  '&:before': {
    content: "''",
    height: `113%`,
    width: `100%`,
    left: '0%',
    top: `0%`,
    position: 'absolute',
    backgroundImage: `url(${chequered})`,

    backgroundSize: `100% 65%`,
    backgroundRepeat: `no-repeat`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundPositionY: `10%, 2%`,
    [theme.breakpoints.down('xl')]: {
      // width: `100vw`,
    },
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `100% 55%`,
    },
    [theme.breakpoints.down('md')]: {
      backgroundSize: `auto 70%`,
    },
  },
}))

export const LeftEllipse = styled('div')(({ theme }) => ({
  '&:before': {
    content: "''",
    height: `113%`,
    width: `100%`,
    left: '0%',
    top: `5%`,
    position: 'absolute',
    backgroundImage: `url(${leftEllipse})`,
    backgroundSize: `100% 100%, 100%, 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundPositionY: `10%, 2%`,
    [theme.breakpoints.down('xl')]: {
      top: '0%',
      // width: `100vw`,
    },
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `auto 85%`,
      backgroundPositionX: `0%`,
      backgroundPositionY: `40%`,
    },
    [theme.breakpoints.down('md')]: {
      top: '-5%',
      backgroundPositionY: `50%`,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

export const RightEllipse = styled('div')(({ theme }) => ({
  '&:before': {
    content: "''",
    height: `113%`,
    width: `100%`,
    left: '0%',
    top: `0%`,
    position: 'absolute',
    backgroundImage: `url(${rightEllipse})`,
    backgroundSize: `100% 100%, 100%, 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundPositionY: `10%, 2%`,
    [theme.breakpoints.down('xl')]: {
      // width: `100vw`,
    },

    [theme.breakpoints.down('md')]: {
      // backgroundSize: `40%`,
      height: `40%`,
      backgroundPositionX: `100%`,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

export const WaveVector = styled('div')(({ theme }) => ({
  '&:before': {
    content: "''",
    height: `113%`,
    width: `100%`,
    left: '0%',
    top: `50%`,
    position: 'absolute',
    backgroundImage: `url(${waveVector})`,
    backgroundSize: `100% 60%`,
    backgroundRepeat: `no-repeat`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundPositionY: `10%, 2%`,
    [theme.breakpoints.down('xl')]: {
      // width: `100vw`,
    },
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `100% 55%`,
    },
    [theme.breakpoints.down('sm')]: {
      backgroundSize: `250%, 100%`,
      backgroundPositionX: `50%, 0%, 0%`,
    },
  },
}))

export const ArrowScrollContainer = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  flexDirection: 'row',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))
export const Line = styled('div')(() => ({
  height: '1px',
  width: '45%',
  backgroundColor: '#FFFFFF',
  opacity: 0.15,
}))
export const ArrowCircle = styled('div')(() => ({
  position: 'relative',
  width: '96px',
  height: '96px',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10,
  overflow: 'hidden',
}))
export const StyledIcon = styled(`img`)(() => ({
  width: '100%',
  height: '50%',
  transform: 'rotate(90deg)',
  position: 'absolute',
  transition: 'all 0.4s ease-in-out',
  cursor: 'pointer',
}))

export const StyledDiversionStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '5rem',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0),
    flexDirection: 'column',
    gap: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
    flexDirection: 'column',
    gap: '2rem',
  },
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(12, 0, 6, 0),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(8, 0, 4, 0),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
    margin: theme.spacing(7, 0, 2, 0),
  },
}))

export const StyledLogo = styled('img')(({ theme }) => ({
  width: '120px',
  margin: theme.spacing(-2, 0),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(-3, 0, -2, 0),
  },
  [theme.breakpoints.down('sm')]: {
    width: '90px',
  },
}))
export const StyledTextSpace = styled(Stack)(({ theme }) => ({
  zIndex: 5,
  height: 'auto',
  width: '50%',

  [theme.breakpoints.down('md')]: {
    width: '100%',
    alignItems: 'center',
  },
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  background: '-webkit-linear-gradient(45deg, #FFFFFF 100%, #D9D9D9 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontFamily: 'ClashDisplay',
  fontWeight: 700,
  lineHeight: '48px',
  fontSize: '42px',
  letterSpacing: '-0.02em',
  display: 'flex',
  justifyContent: 'flex-start',
  backgroundClip: 'text',
  textAlign: 'left',
  zIndex: 100,
  marginBottom: '20px',

  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    lineHeight: '36.8px',
    fontSize: '28px',
  },
}))

export const StyledDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.75)',
  fontWeight: 300,
  fontFamily: 'Satoshi',
  lineHeight: '30px',
  fontSize: '20px',
  Slant: 0,
  span: {
    fontWeight: 600,
  },
  letterSpacing: '-0.01em',
  textAlign: 'left',
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    lineHeight: '27px',
    fontSize: '18px',
  },
}))
