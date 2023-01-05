import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  width: '100%',
  justifyContent: 'space-between',
  height: '40px',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfDisabledDark,
  ...theme.typography.label,
  textTransform: 'uppercase',
}))
export const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.rfText,
  ...theme.typography.inputText,
}))

export const StyledTextWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}))

export const IconWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(4),
  flexDirection: 'row',
  alignItems: 'center',
}))
