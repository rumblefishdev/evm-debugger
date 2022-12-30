import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(() => ({
  position: 'absolute',
  overflow: 'hidden',
  cursor: 'pointer',
  boxSizing: 'border-box',
  background: 'rgba(255, 129, 120 , .2)',
  // hover
  '&:hover': {
    background: 'rgba(255, 129, 120 , 1)',
  },
}))
