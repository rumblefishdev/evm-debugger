import { Box, Stack, styled, Typography } from '@mui/material'

import type { TEntryType, TOpcodeVariants } from './FunctionEntry.types'

export const StyledFunctionEntryWrapperOptions = {
  shouldForwardProp: (prop: string) => prop !== 'hasThrown',
}

export const StyledFunctionEntryWrapper = styled(
  Stack,
  StyledFunctionEntryWrapperOptions,
)<{ hasThrown?: boolean }>(({ theme, hasThrown }) => ({
  width: '100%',
  ...(hasThrown && {
    border: '1px solid #e6aca8',
  }),
  borderRadius: '2px',

  '&:fist-child': {
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
  },
}))

export const StyledFunctionEntryBodyOptions = {
  shouldForwardProp: (prop: string) => prop !== 'isSuccess',
}
export const StyledFunctionEntryBody = styled(
  Stack,
  StyledFunctionEntryBodyOptions,
)<{ isSuccess?: boolean }>(({ theme, isSuccess }) => ({
  padding: theme.spacing(1),
  height: '100%',
  gap: theme.spacing(1),
  flexDirection: 'row',

  ...(!isSuccess && {
    backgroundColor: '#fae2e1',
  }),
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
  alignItems: 'flex-start',
}))

export const StyledFunctionEntryContent = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  ...theme.typography.body2,
  gap: theme.spacing(0.5),
  fontSize: '16px',
  flexWrap: 'wrap',
  cursor: 'pointer',
}))

export const StyledRevertedBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: '4px',
  border: '1px solid #D37676',
  ...theme.typography.body2,
  fontWeight: '700',
  fontSize: '12px',
  color: '#D37676',
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
  ...(variant === 'Solc' && {
    color: '#8294C4',
    borderColor: '#8294C4',
  }),
}))

export const StyledContractName = styled(Typography)(({ theme }) => ({
  textTransform: 'capitalize',
  fontWeight: '700',

  '&:hover': {
    color: theme.palette.rfButton,
  },
}))
export const StyledFunctionSignature = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  flexDirection: 'row',
  display: 'inline-flex',

  '&:hover': {
    color: theme.palette.rfButton,
  },
}))
