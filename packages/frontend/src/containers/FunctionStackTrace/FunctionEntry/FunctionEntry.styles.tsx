import { Box, Stack, styled } from '@mui/material'

import type { TOpcodeVariants } from './FunctionEntry.types'

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
  ...theme.typography.body2,
  fontSize: '16px',
  cursor: 'pointer',

  '&:hover': {
    color: theme.palette.rfButton,
  },
}))

export const StyledOpcodeBoxOptions = {
  shouldForwardProp: (prop: string) => prop !== 'variant',
}
export const StyledOpcodeBox = styled(
  Box,
  StyledOpcodeBoxOptions,
)<{ variant: TOpcodeVariants }>(({ theme, variant }) => ({
  padding: theme.spacing(0.5, 1),
  color: 'white',
  borderRadius: '4px',
  ...theme.typography.body2,
  fontSize: '12px',

  ...(variant === 'Call' && {
    backgroundColor: 'blue',
  }),
  ...(variant === 'Create' && {
    backgroundColor: 'purple',
  }),
  ...(variant === 'Jumpdest' && {
    backgroundColor: 'green',
  }),
  ...(variant === 'Missing' && {
    backgroundColor: 'grey',
  }),
}))
