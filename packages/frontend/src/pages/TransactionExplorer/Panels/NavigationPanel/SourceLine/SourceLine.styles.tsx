import { Stack, Typography, styled } from '@mui/material'

export const StyledWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
}))

export const StyledHeadingWrapper = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  color: theme.palette.rfText,
}))

export const StyledCode = styled(Typography)(({ theme }) => ({
  ...theme.typography.label,
  lineHeight: '1.2rem',
  fontSize: '1rem',
  color: '#436850',
}))

export const StyledNavigationButtonsWrapper = styled(Stack)(({ theme }) => ({
  marginTop: '1rem',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
}))
