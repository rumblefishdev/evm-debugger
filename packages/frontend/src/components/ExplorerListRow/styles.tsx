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

export const StyledCounter = styled(Typography)(() => ({
  width: '64px',
  textAlign: 'right',
  marginRight: '24px',
}))

export const StyledType = styled(Typography)(() => ({
  width: '152px',
  marginRight: '24px',
}))

export const StyledOpcodeDescriptionIcon = styled(HelpOutline)(() => ({
  width: '12px',
  marginLeft: '4px',
  height: '12px',
}))
