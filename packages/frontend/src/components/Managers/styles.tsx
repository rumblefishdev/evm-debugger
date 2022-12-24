import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  overflow: 'auto',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
}))

export const StyledTitle = styled(Typography)(() => ({
  marginBottom: '24px',
  fontSize: '32px',
}))
