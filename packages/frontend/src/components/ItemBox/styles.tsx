import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  transition: 'all 0.2s ease-in-out',
  position: 'absolute',
  overflow: 'hidden',
  justifyContent: 'center',
  flexWrap: 'wrap',
  display: 'flex',
  cursor: 'pointer',
  boxSizing: 'border-box',
  background: 'rgba(255, 129, 120 , .2)',
  alignItems: 'center',
  '&:hover': {
    background: 'rgba(255, 129, 120 , 1)',
  },
}))

export const TextTest = styled(Typography)(() => ({
  fontSize: '12px',
}))
