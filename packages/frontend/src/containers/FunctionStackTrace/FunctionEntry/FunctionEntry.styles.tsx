import { Box, Stack, styled, Typography } from '@mui/material'

import type { TEntryType, TOpcodeVariants } from './FunctionEntry.types'

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
  textTransform: 'uppercase',
  minWidth: '204px',
  gap: theme.spacing(1),
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

export const StyledRevertedBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: '4px',
  backgroundColor: '#D37676',
  ...theme.typography.body2,
  fontSize: '12px',
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
    color: 'white',
    backgroundColor: '#545B77',
  }),
  ...(variant === 'Create' && {
    color: 'white',
    backgroundColor: '#8E7AB5',
  }),
  ...(variant === 'Jumpdest' && {
    color: 'white',
    backgroundColor: '#B0A695',
  }),
  ...(variant === 'Missing' && {
    backgroundColor: '#B4B4B8',
  }),
}))

export const StyledEntryVariantBoxOptions = {
  shouldForwardProp: (prop: string) => prop !== 'variant',
}
export const StyledEntryVariantBox = styled(
  Box,
  StyledEntryVariantBoxOptions,
)<{ variant: TEntryType }>(({ theme, variant }) => ({
  padding: theme.spacing(0.5, 1),

  borderRadius: '4px',
  ...theme.typography.body2,
  fontSize: '12px',
  border: '1px solid',

  ...(variant === 'Main' && {
    color: '#6a73a8',
    borderColor: '#6a73a8',
  }),
  ...(variant === 'Yul' && {
    color: '#9DBC98',
    borderColor: '#9DBC98',
  }),
  ...(variant === 'NonMain' && {
    color: '#8294C4',
    borderColor: '#8294C4',
  }),
}))

export const StyledContractName = styled(Typography)(({ theme }) => ({
  textTransform: 'capitalize',
  fontWeight: '700',
}))
export const StyledFunctionSignature = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  flexDirection: 'row',
  display: 'inline-flex',
}))

export const StyledFunctionSingatureParameter = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  padding: theme.spacing(0, 0.5),
  margin: theme.spacing(0, 0.5),
  borderRadius: '4px',
}))
