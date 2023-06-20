import type { ButtonProps as MuiButtonProps } from '@mui/material'

export interface ButtonProps extends MuiButtonProps {
  onClick: () => void
}
