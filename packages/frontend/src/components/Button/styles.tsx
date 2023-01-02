import { styled } from '@mui/material'
import { ButtonUnstyled } from '@mui/base'

import type { TButtonVariant } from './Button.types'

export const StyledButton = styled(ButtonUnstyled)<{ variant: TButtonVariant }>(({ theme, variant }) => ({
  outline: 'none',
  cursor: 'pointer',
  border: 'none',
  ...(variant === 'contained' && {
    padding: theme.spacing(3, 6),
    color: theme.palette.rfWhite,
    borderRadius: '32px',
    backgroundColor: theme.palette.rfButton,
  }),
  ...(variant === 'outlined' && {
    padding: theme.spacing(3, 6),
    color: theme.palette.rfButton,
    borderRadius: '32px',
    border: `1px solid ${theme.palette.rfLines}`,
    backgroundColor: 'unset',
  }),
}))
