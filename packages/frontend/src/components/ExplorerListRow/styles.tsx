import { HelpOutline } from '@mui/icons-material'
import { Box, Stack, styled, Typography } from '@mui/material'

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

export const StyledChip = styled(Box)(() => ({
  padding: '4px 8px',
  maxWidth: '96px',
  justifyContent: 'center',
  display: 'flex',
  borderRadius: '48px',
  backgroundColor: '#F5F5F5',
  alignItems: 'center',
}))

export const StyledChipText = styled(Typography)(() => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontSize: '12px',
}))
