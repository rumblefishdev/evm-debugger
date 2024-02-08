import { Stack, TextField, Typography, styled } from '@mui/material'

export const StyledQuickLinksHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingUnknown,
  fontSize: '18px',
  color: theme.palette.rfSecondary,
}))

export const StyledHeadingWrapper = styled(Stack)(() => ({
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}))

export const StyledInfo = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 4),
  color: theme.palette.rfDisabledDark,
}))
