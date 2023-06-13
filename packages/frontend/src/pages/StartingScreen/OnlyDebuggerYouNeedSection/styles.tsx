import { Stack, styled, Typography } from '@mui/material'

import centerEllipse from '../../../assets/png/centerEllipse.png'

export const CenterEllipse = styled('div')(({ theme }) => ({
  '&:before': {
    width: `100%`,
    top: '-10%',
    position: 'absolute',
    left: '0%',
    height: `100%`,
    content: "''",
    backgroundSize: `120% 120%, 100%, 100%`,
    backgroundRepeat: `no-repeat`,
    backgroundPositionX: `20%, 100%, 70%`,
    backgroundImage: `url(${centerEllipse})`,
    // backgroundPositionY: `10%, 2%`,
    // [theme.breakpoints.down('lg')]: {
    //     backgroundSize: `130% 55%`,
    //     width: `100vw`,
    //     backgroundPositionX: `40%, 100%, 70%`,
    //     top: '-25%'
    // },
    [theme.breakpoints.down('lg')]: {
      top: '-20%',
      backgroundSize: `auto 120%`,
      backgroundPositionX: `50%, 100%, 70%`,
    },
    [theme.breakpoints.down('md')]: {
      top: '-30%',
      backgroundSize: `auto 110%`,
      backgroundPositionX: `50%, 100%, 70%`,
    },
    // [theme.breakpoints.down('sm')]: {
    //     backgroundSize: `129% 129%, 100%, 100%`,
    //     backgroundPositionX: `50%, 100%, 70%`,

    // },
  },
}))

export const Line = styled('div')(({ theme }) => ({
  width: '100%',
  opacity: 0.15,
  marginTop: theme.spacing(10),
  height: '1px',
  backgroundColor: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))

export const StyledBlocksStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  justifyContent: 'space-evenly',
  gap: '1rem',
  flexWrap: 'wrap',
  flexDirection: 'row',
  display: 'flex',
}))
export const Block = styled(Stack)(({ theme }) => ({
  width: '392px',
  padding: theme.spacing(5),
  display: 'flex',
  borderRadius: '8px',

  background:
    ' radial-gradient(47.45% 48.31% at -0.77% 0%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%) , rgba(255, 255, 255, 0.01)',

  // background: " radial-gradient(47.45% 48.31% at -0.77% 0%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%) , rgba(255, 255, 255, 0.01)",
  backdropFilter: 'blur(12px)',

  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    width: '350px',
  },
}))

export const StyledStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0, 0, 8, 0),
  justifyContent: 'center',
  gap: theme.spacing(5),
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(6, 0, 0, 0),
    gap: theme.spacing(4),
  },
}))

export const StyledBlocksText = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  slant: 0,
  lineHeight: '30px',
  letterSpacing: '-1%',
  fontWeight: '650',
  fontSize: '24px',
  color: '#FFFFFF',

  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    lineHeight: '36.8px',
    fontSize: '30px',
  },
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  /* eslint-disable */
  background: "-webkit-linear-gradient(45deg, #FFFFFF 100%, #D9D9D9 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  zIndex: 10,
    /* eslint-enable */

  textAlign: 'center',
  margin: theme.spacing(0, 0, 5, 0),
  lineHeight: '64px',
  letterSpacing: '-2%',
  fontWeight: '700',
  fontSize: '64px',
  backgroundClip: 'text',

  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(0, 0, 1, 0),
  },
  [theme.breakpoints.down('sm')]: {
    lineHeight: '36.8px',
    fontSize: '32px',
  },
}))

export const StyledDescription = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  lineHeight: '27.6px',
  letterSpacing: '-2%',
  fontWeight: '700',
  fontSize: '22px',
  color: '#FFFFFF',

  [theme.breakpoints.down('sm')]: {
    lineHeight: '27.6px',
    fontSize: '20px',
  },
}))
