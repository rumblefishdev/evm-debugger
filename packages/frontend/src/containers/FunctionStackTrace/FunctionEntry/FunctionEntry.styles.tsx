import { Box, Stack, styled } from '@mui/material'

export const StyledFunctionEntryWrapper = styled(Stack)(({ theme }) => ({}))
export const StyledFunctionEntryBody = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'row',
}))

export const StyledVerticalLine = styled(Box)(({ theme }) => ({
  width: '1px',
  marginLeft: theme.spacing(1),
  borderLeft: `1px solid black`,
}))

export const StyledFunctionEntryLeftWrapper = styled(Stack)(({ theme }) => ({
  minWidth: '84px',
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledFunctionEntryContent = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
}))

export const StyledOpcodeBox = styled(Box)(({ theme }) => ({}))
