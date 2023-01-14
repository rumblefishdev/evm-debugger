import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(() => ({
  zIndex: 0,
  transition: 'all 0.2s ease-in-out',
  position: 'absolute',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: '3px',
  border: '1px solid rgba(47, 87, 244, 0)',
  background: 'rgba(47, 87, 244, 0.15)',
}))

export const StyledNestedItemsBox = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden',
}))
