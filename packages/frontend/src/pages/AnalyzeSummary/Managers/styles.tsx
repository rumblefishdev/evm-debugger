import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  width: '100%',
  overflow: 'auto',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'column',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  marginBottom: theme.spacing(6),
  color: theme.palette.rfSecondary,
}))

export const StyledAddress = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  fontSize: '16px',
  fontFamily: 'Inter',
  color: theme.palette.rfDisabledDark,
}))

export const StyledAbisWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  paddingRight: theme.spacing(2),
  overflow: 'auto',
  boxSizing: 'border-box',
  ...theme.customStyles.scrollbar,
}))

export const StyledSighashesWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(4),
}))
