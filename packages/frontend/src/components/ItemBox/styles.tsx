import { Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  position: 'absolute',
  overflow: 'hidden',
  justifyContent: 'center',
  display: 'flex',
  cursor: 'pointer',
  boxSizing: 'border-box',
  background: 'rgba(255, 129, 120 , .2)',
  alignItems: 'center',
  '&:hover': {
    background: 'rgba(255, 129, 120 , 1)',
  },
}))
