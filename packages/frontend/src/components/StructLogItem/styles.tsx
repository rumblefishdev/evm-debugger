import { HelpOutline } from '@mui/icons-material'
import { AccordionSummary, Stack, styled, Typography } from '@mui/material'

export const StyledStack = styled(Stack)(() => ({
  flexDirection: 'row',
  cursor: 'pointer',
  alignItems: 'center',
}))

export const StyledAcoordionSummary = styled(AccordionSummary)(() => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}))

export const StyledCounter = styled(Typography)(() => ({
  width: '64px',
  textAlign: 'right',
  marginRight: '24px',
}))

export const StyledType = styled(Typography)(() => ({
  width: '136px',
  marginRight: '24px',
}))

export const StyledArgsWrapper = styled(Stack)(() => ({
  flexDirection: 'column',
}))
export const StyledArgsItemWrapper = styled(Stack)(() => ({
  margin: '8px 0',
  flexDirection: 'row',
  cursor: 'pointer',
}))

export const StyledArgName = styled(Typography)(() => ({
  width: '64px',
  textAlign: 'right',
  marginRight: '24px',
  fontWeight: 'bold',
  fontSize: '14px',
  fontFamily: 'roboto mono',
}))

export const StyledArgValue = styled(Typography)(() => ({
  fontSize: '14px',
  fontFamily: 'roboto mono',
}))

export const StyledOpcodeDescriptionIcon = styled(HelpOutline)(() => ({
  width: '12px',
  marginLeft: '4px',
  height: '12px',
}))
