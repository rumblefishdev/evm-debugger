import { Stack, styled } from '@mui/material'

export const StyledWrapper = styled(Stack)(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}))

export const StyledContainer = styled(Stack)(() => ({
  width: '100%',
  overflow: 'hidden',
  maxWidth: '1600px',
  justifyContent: 'center',
  height: '100vh',
  alignItems: 'center',
}))
