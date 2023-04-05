import { Button, Stack, styled, Typography } from '@mui/material'

export const StyledDisabledBytecode = styled(Stack)(() => ({
  width: '100%',
  textAlign: 'center',
  padding: '8px 16px',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
  background: 'rgba(0, 0, 0, 0.38)',
  alignItems: 'center',
}))

export const StyledButton = styled(Button)(({ theme }) => ({
  transform: `translate(${theme.spacing(2)}, -50%)`,
  top: '50%',
  position: 'absolute',
}))

export const NoSourceCodeHero = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(16)} ${theme.spacing(8)}`,
  justifyContent: 'center',
  fontSize: theme.typography.body1.fontSize,
  display: 'flex',
  alignItems: 'center',
}))
