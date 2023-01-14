import { Card, Box, styled } from '@mui/material'

export const StyledWrapper = styled(Box)(() => ({
  width: '100%',
  overflow: 'hidden',
  maxWidth: '1028px',
  height: '100%',
}))
export const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  transition: 'all 0.3s ease',
  position: 'relative',
  height: '100%',
  borderRadius: '3px',
}))
