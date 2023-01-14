import { Stack, styled } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  transition: 'all 0.2s ease-in-out',
  position: 'absolute',
  overflow: 'hidden',
  justifyContent: 'center',
  flexWrap: 'wrap',
  display: 'flex',
  cursor: 'pointer',
  borderRadius: '3px',
  border: '1px solid rgba(47, 87, 244, 0)',
  background: 'rgba(47, 87, 244, 0.15)',
  alignItems: 'center',
}))
