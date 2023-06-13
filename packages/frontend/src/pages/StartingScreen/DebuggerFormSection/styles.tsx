import { Stack, styled, Typography } from '@mui/material'

import chequered from '../../../assets/png/chequered.png'
import waveVector from '../../../assets/png/waveVector.png'
import rightEllipse from '../../../assets/png/rightEllipse.png'
import leftEllipse from '../../../assets/png/leftEllipse.png'

export const Chequered = styled('div')(({ theme }) => ({
  '&:before': {
    width: `99.24vw`,
    top: `0%`,
    position: 'absolute',
    left: '0%',
    height: `113%`,
    content: "''",
    backgroundSize: `100% 65%`,

    backgroundRepeat: `no-repeat`,
    backgroundPositionY: `10%, 2%`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundImage: `url(${chequered})`,
    [theme.breakpoints.down('xl')]: {
      width: `100vw`,
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
    width: `99.24vw`,
    top: `10%`,
    position: 'absolute',
    left: '0%',
    height: `113%`,
    content: "''",
    // filter: 'brightness(0.5)',
    backgroundSize: `100% 100%, 100%, 100%`,

    backgroundRepeat: `no-repeat`,
    backgroundPositionY: `10%, 2%`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundImage: `url(${leftEllipse})`,
    [theme.breakpoints.down('xl')]: {
      width: `100vw`,
      top: '0%',
    },
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `auto 85%`,
      backgroundPositionY: `40%`,
      backgroundPositionX: `0%`,
    },
    [theme.breakpoints.down('md')]: {
      backgroundPositionY: `50%`,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

export const RightEllipse = styled('div')(({ theme }) => ({
  '&:before': {
    width: `99.24vw`,
    top: `0%`,
    position: 'absolute',
    left: '0%',
    height: `113%`,
    content: "''",
    // filter: 'brightness(0.5)',
    backgroundSize: `100% 100%, 100%, 100%`,

    backgroundRepeat: `no-repeat`,
    backgroundPositionY: `10%, 2%`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundImage: `url(${rightEllipse})`,
    [theme.breakpoints.down('xl')]: {
      width: `100vw`,
    },
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `100% 55%`,
    },
    [theme.breakpoints.down('md')]: {
      backgroundSize: `auto 40%`,
      backgroundPositionX: `100%`,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

export const WaveVector = styled('div')(({ theme }) => ({
  '&:before': {
    width: `99.24vw`,
    top: `50%`,
    position: 'absolute',
    left: '0%',
    height: `113%`,
    content: "''",
    // filter: 'brightness(0.5)',
    backgroundSize: `100% 60%`,

    backgroundRepeat: `no-repeat`,
    backgroundPositionY: `10%, 2%`,
    backgroundPositionX: `10%, 100%, 70%`,
    backgroundImage: `url(${waveVector})`,
    [theme.breakpoints.down('xl')]: {
      width: `100vw`,
    },
    [theme.breakpoints.down('lg')]: {
      backgroundSize: `100% 55%`,
    },
    [theme.breakpoints.down('md')]: {
      // backgroundSize: `auto 70%`,
    },
    [theme.breakpoints.down('sm')]: {
      backgroundSize: `250%, 100%`,
      backgroundPositionX: `50%, 0%, 0%`,
    },
  },
}))

export const ArrowScrollContainer = styled('div')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(10),
  justifyContent: 'space-between',
  flexDirection: 'row',
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))
export const Line = styled('div')(({ theme }) => ({
  width: '45%',
  opacity: 0.15,
  height: '1px',
  backgroundColor: '#FFFFFF',
}))
export const ArrowCircle = styled('div')(({ theme }) => ({
  zIndex: 10,
  width: '96px',
  // overflow: "hidden",
  position: 'relative',
  overflow: 'hidden',
  justifyContent: 'center',
  height: '96px',
  display: 'flex',
  cursor: 'pointer',
  borderRadius: '100%',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'transparent',
  alignItems: 'center',
}))
export const StyledIcon = styled(`img`)(() => ({
  width: '100%',
  transition: 'all 0.4s ease-in-out',
  transform: 'rotate(90deg)',
  position: 'absolute',
  height: '50%',
  // '&:hover': {
  //     transform: 'translateY(50px)',
  //     transition: 'transform 0.3s ease',
  // },
  cursor: 'pointer',
}))

export const StyledDiversionStack = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  gap: '5rem',
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0),
    gap: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
    gap: '2rem',
    flexDirection: 'column',
  },
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(12, 0, 6, 0),
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    // padding: theme.spacing(12, 0),
    margin: theme.spacing(8, 0, 4, 0),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
    margin: theme.spacing(7, 0, 2, 0),
  },
}))
export const StyledTextSpace = styled('div')(({ theme }) => ({
  zIndex: 5,
  width: '50%',
  height: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  /* eslint-disable */
  background: "-webkit-linear-gradient(45deg, #FFFFFF 100%, #D9D9D9 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  zIndex: 100,
  /* eslint-enable */
  textAlign: 'left',
  lineHeight: '48px',
  letterSpacing: '-0.02em',
  justifyContent: 'flex-start',
  fontWeight: '700',
  fontSize: '48px',
  display: 'flex',

  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    lineHeight: '36.8px',
    justifyContent: 'center',
    fontSize: '30px',
  },
}))

export const StyledDescription = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  span: {
    fontWeight: '650',
  },
  Slant: 0,
  lineHeight: '30px',
  letterSpacing: '-0.01em',
  fontWeight: '350',
  fontSize: '20px',
  fontFamily: 'Inter',
  color: 'rgba(255, 255, 255, 0.75)',
  // color: theme.palette.colorBrand.secondary,

  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    lineHeight: '27px',
    fontSize: '18px',
  },
}))
