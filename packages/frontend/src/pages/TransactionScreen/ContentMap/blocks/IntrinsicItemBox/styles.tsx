import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(() => ({
  position: 'absolute',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: '3px',
  border: '1px solid rgba(47, 87, 244, 0)',
  background: 'rgba(47, 87, 244, 0.15)',
}))
