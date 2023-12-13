import { Stack, Typography, styled, Box } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '262px',
  padding: theme.spacing(1.5),
  justifyContent: 'space-around',
  height: 'auto',
  flexFlow: 'row',
  cursor: 'pointer',
  borderRadius: '8px',
  alignItems: 'flex-start',
  ...theme.mixins.defaultTransition,
  '&:hover': {
    '& .MuiTypography-root:first-of-type': theme.mixins.hoverTextLightBlue,
  },
  [theme.breakpoints.up('md')]: {
    '&:hover': {
      background: '#F2F4F8',
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: 0,
    justifyContent: 'flex-start',
  },
}))
export const StyledText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.colorGrey?.primary,
}))
export const StyledHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.colorBrand?.primary,
  ...theme.mixins.defaultTransition,

  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
}))
export const StyledImage = styled(`img`)(({ theme }) => ({
  position: 'absolute',
  opacity: 0,
  maxWidth: '26px',
  ...theme.mixins.defaultTransition,
}))
export const StyledImageWrapper = styled(Box)(({ theme }) => ({
  width: '24px',
  position: 'relative',
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
  height: '24px',
  ...theme.mixins.defaultTransition,
}))
export const StyledTextWrapper = styled(Stack)(({ theme }) => ({
  ...theme.mixins.flexColumnStartStart,
  margin: theme.spacing(0.25, 0, 0, 0.5),
  [theme.breakpoints.down('md')]: {
    margin: 'unset',
  },
}))
