import { styled } from '@mui/material'
import { ButtonUnstyled } from '@mui/base'

import type { TButtonVariant } from './Button.types'

export const StyledButton = styled(ButtonUnstyled, {
  shouldForwardProp: (prop) => prop !== 'big',
})<{
  variant: TButtonVariant
  big?: boolean
  disabled?: boolean
}>(({ theme, variant, disabled, big }) => ({
  outline: 'none',
  cursor: 'pointer',
  border: 'none',
  ...theme.typography.buttonSmall,
  ...(variant === 'contained' && {
    padding: theme.spacing(3, 6),
    color: theme.palette.rfWhite,
    borderRadius: '32px',
    backgroundColor: theme.palette.rfButton,
    ...(big && {
      padding: theme.spacing(4, 8),
      ...theme.typography.buttonBig,
    }),
    ...(disabled && {
      color: theme.palette.rfDisabled,
      backgroundColor: theme.palette.rfLinesLight,
    }),
  }),
  ...(variant === 'outlined' && {
    padding: theme.spacing(3, 6),
    color: theme.palette.rfButton,
    borderRadius: '32px',
    border: `1px solid ${theme.palette.rfLines}`,
    backgroundColor: 'unset',
  }),
  ...(variant === 'text' && {
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: 'Rajdhani',
    color: theme.palette.rfButton,
    backgroundColor: 'unset',
  }),
}))
