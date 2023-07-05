import { Stack, Typography, styled } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '430px',
  padding: theme.spacing(1.5),
  justifyContent: 'space-around',
  height: 'auto',
  flexFlow: 'row',
  cursor: 'pointer',
  borderRadius: '8px',
  alignItems: 'center',
  ...theme.mixins.defaultTransition,
  '&:hover': {
    background: '#F2F4F8',
  },
  [theme.breakpoints.down('lg')]: {
    width: '400px',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: 0,
    maxWidth: '480px',
    justifyContent: 'flex-start',
  },
}))
export const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.colorGrey?.primary,
}))
export const StyledHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.colorBrand?.primary,
}))
export const StyledImage = styled(`img`)(({ theme }) => ({
  marginRight: theme.spacing(1),
}))
export const StyledTextWrapper = styled(Stack)(({ theme }) => ({
  ...theme.mixins.flexColumnStartStart,
  margin: theme.spacing(0.25, 0, 0, 0.5),
}))
