import { Stack, Typography, styled } from '@mui/material'

export const StyledMissingBytecodeContainer = styled(Stack)(() => ({
  width: '100%',
  textAlign: 'center',
  padding: '8px 16px',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
  boxSizing: 'border-box',
  background: 'rgba(0, 0, 0, 0.38)',
  alignItems: 'center',
}))

export const StyledMissingBytecodeText = styled(Typography)({})
