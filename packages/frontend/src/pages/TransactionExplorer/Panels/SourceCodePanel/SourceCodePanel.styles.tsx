import { Stack, Typography, styled } from '@mui/material'

export const StyledSourceCodePanel = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  height: '100%',
  boxSizing: 'border-box',
  boxShadow: '0px 0px 8px 0px rgba(0, 10, 108, 0.2)',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
}))

export const StyledSourceWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  overflowY: 'hidden',
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'row',
}))

export const NoSourceCodeHero = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(16)} ${theme.spacing(8)}`,
  justifyContent: 'center',
  fontSize: theme.typography.body1.fontSize,
  display: 'flex',
  alignItems: 'center',
}))
