import { Stack, Typography, styled } from '@mui/material'

export const StyledSourceCodePanel = styled(Stack)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  minHeight: '50%',
  boxSizing: 'border-box',
}))

export const StyledSourceWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflowY: 'hidden',
  height: '100%',
  gap: theme.spacing(4),
  flexDirection: 'row',
}))

export const NoSourceCodeHero = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(16)} ${theme.spacing(8)}`,
  justifyContent: 'center',
  fontSize: theme.typography.body1.fontSize,
  display: 'flex',
  alignItems: 'center',
}))
