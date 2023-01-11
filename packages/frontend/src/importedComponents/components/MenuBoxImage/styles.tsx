import { Stack, Typography, styled } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '317px',
  padding: theme.spacing(1.5),
  height: 'auto',
  cursor: 'pointer',
  borderRadius: '8px',
  ...theme.mixins.defaultTransition,
  '&:hover': {
    background: theme.palette.colorBackground?.dark,
    '& .MuiTypography-root:last-of-type': theme.mixins.hoverTextLightBlue,
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(1.5, 0),
  },
}))
export const StyledHeadline = styled(Typography)(({ theme }) => ({
  color: theme.palette.colorBrand?.primary,
  [theme.breakpoints.down('md')]: {
    color: theme.palette.colorGrey?.primary,
  },
}))
export const StyledText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.colorGrey?.primary,
  ...theme.mixins.defaultTransition,
  [theme.breakpoints.down('md')]: {
    fontSize: '0.875rem',
    color: theme.palette.colorBrand?.primary,
  },
}))
export const StyledImage = styled(`img`)(() => ({
  width: '64px',
  height: '64px',
  borderRadius: '6px',
  alignSelf: 'flex-start',
}))
export const StyledTextWrapper = styled(Stack)(({ theme }) => ({
  ...theme.mixins.flexColumnStartStart,
}))
