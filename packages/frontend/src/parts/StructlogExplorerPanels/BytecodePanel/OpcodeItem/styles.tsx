import { HelpOutline } from '@mui/icons-material'
import { Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  minHeight: '64px',
  flexDirection: 'row',
  cursor: 'pointer',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#F5F5F5',
  },
}))
