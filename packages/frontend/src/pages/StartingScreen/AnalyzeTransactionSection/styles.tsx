import { Stack, styled, Typography } from '@mui/material'

import chequered from '../../../assets/png/chequered.png'

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
      display: 'none',
      backgroundSize: `auto 70%`,
    },
  },
}))
export const StyledBlocksStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  flexWrap: 'wrap',
  flexDirection: 'row',
  display: 'flex',

  '& > div:nth-child(n+5)': {
    borderBottom: '0px',
  },
  '& > div:nth-child(4n+5)': {
    borderLeft: '0px',
  },
  '& > div:nth-child(-n+1)': {
    borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
  },
  '& > * + *': {
    borderLeft: '1px dashed rgba(255, 255, 255, 0.1)',
    borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
  },
  [theme.breakpoints.down('md')]: {
    '& > div:nth-child(n)': {
      borderBottom: '1px dashed rgba(255, 255, 255, 0.1)',
    },
    '& > div:nth-child(2n+3)': {
      borderLeft: '0px',
    },
  },
}))
export const StyledIcon = styled(`img`)(() => ({
  transition: 'all 0.4s ease-in-out',
  opacity: 1,
}))
export const Block = styled(Stack)(({ theme }) => ({
  // background: "rgba(255, 255, 255, 0.03)",
  padding: theme.spacing(4),

  gap: '2rem',

  flex: '1 0 21%',

  display: 'flex',

  backdropFilter: 'blur(12px)',
  [theme.breakpoints.down('md')]: {
    // width: "350px",
    padding: theme.spacing(2),
    gap: '1rem',
    flex: '1 0 48%',
  },
}))
export const BlockIconStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {},
}))

export const Line = styled('div')(({ theme }) => ({
  width: '100%',
  opacity: 0.15,
  marginTop: theme.spacing(10),
  height: '1px',
  backgroundColor: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(6),
  },
}))

export const IconCircleStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(4),
  justifyContent: 'center',
  display: 'flex',
  borderRadius: '100%',
  background:
    'radial-gradient(47.45% 48.31% at -0.77% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 40%),radial-gradient(52.75% 141.29% at 0% 0%, rgba(255, 255, 255, 0.09) 0%, rgba(249, 39, 127, 0) 60%, rgba(255, 255, 255, 0) 100%),radial-gradient(58.93% 157.84% at 98.5% 10%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%),linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03))',
  alignItems: 'center',
  // border: "1px solid ",

  // borderImageSource: "radial-gradient(58.93% 157.84% at 98.5% 100%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%),radial-gradient(52.75% 141.29% at 0% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(249, 39, 127, 0) 100%, rgba(255, 255, 255, 0) 100%)",

  // borderColor: "-webkit-radial-gradient(90deg, #FFFFFF 5%, #D9D9D9 0%)",
}))
export const StyledStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 0),
  justifyContent: 'center',
  gap: theme.spacing(5),
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(6, 0, 6, 0),
    gap: theme.spacing(4),
  },
}))

export const StyledBlocksText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  opacity: 0.7,
  lineHeight: '24px',
  letterSpacing: '-0.1em',
  fontWeight: '350',
  fontVariationSettings: 'slnt 0',
  fontSize: '16px',
  fontFamily: 'Inter',
  color: '#FFFFFF',
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
  lineHeight: '64.4px',
  letterSpacing: '-2%',
  fontWeight: '700',
  fontSize: '56px',

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

export const NetworksStyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(10),
  gap: theme.spacing(5),
  flexDirection: 'column',
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(6),
  },
}))
export const CurrentsNetworksStyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    gap: theme.spacing(4),
  },
}))

export const NetworksHeading = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  opacity: 0.75,
  lineHeight: '36px',
  letterSpacing: '-1%',
  fontWeight: '350',
  fontVariationSettings: 'slnt 0',
  fontSize: '24px',
  color: '#FFFFFF',
}))

export const NetworkName = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  lineHeight: '27.6px',
  letterSpacing: '-2%',
  fontWeight: '700',
  fontVariationSettings: 'slnt 0',
  fontSize: '24px',
  fontFamily: 'Rajdhani',
}))
