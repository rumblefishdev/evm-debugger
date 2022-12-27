import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(() => ({
  transition: 'all 0.2s ease-in-out',
  position: 'absolute',
  overflow: 'hidden',
  cursor: 'pointer',
  boxSizing: 'border-box',
}))

export const StyledInfoPanel = styled(Box)(() => ({
  justifyContent: 'center',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
}))

export const StyledNestedItemsBox = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
}))
