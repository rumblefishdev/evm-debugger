import { MenuItem, Select, Stack, styled, TextField, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(4),
  alignItems: 'center',
}))
export const StyledInputWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(2),
  flexDirection: 'column',
}))
export const StyledInput = styled(TextField)(() => ({}))
export const StyledInputLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.label,
  textTransform: 'uppercase',
}))
export const StyledSelect = styled(Select)(() => ({}))
export const StyledMenuItem = styled(MenuItem)(() => ({}))
