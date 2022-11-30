import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(() => ({
  position: 'absolute',
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
  boxSizing: 'border-box',
}))
