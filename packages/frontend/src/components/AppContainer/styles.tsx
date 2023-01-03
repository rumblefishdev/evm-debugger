import { Stack, styled } from '@mui/material'

export const StyledWrapper = styled(Stack)(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}))

export const StyledContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(6),
  overflow: 'hidden',
  maxWidth: '1600px',
  justifyContent: 'center',
  height: 'calc(100vh - 48px)',
  gap: theme.spacing(6),
  flexDirection: 'row',
  boxSizing: 'border-box',
  alignItems: 'center',
}))
