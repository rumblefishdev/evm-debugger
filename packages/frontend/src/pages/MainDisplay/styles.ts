import { Box, styled, Stack } from '@mui/material'

export const StyledMainDisplay = styled(Box)(() => ({
  width: '100vw',
  height: '100vh',
}))

export const StyledContentWrapper = styled(Stack)(() => ({
  width: '100%',
  padding: '12px',
  justifyContent: 'space-around',
  height: '100%',
  flexDirection: 'row',
  display: 'flex',
  boxSizing: 'border-box',
  alignItems: 'center',
}))
