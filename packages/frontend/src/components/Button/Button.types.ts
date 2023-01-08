import type { ButtonUnstyledProps } from '@mui/base'

export type TButtonVariant = 'text' | 'outlined' | 'contained'

export type TButtonClasses = {
  root: string
  text: string
  outlined: string
  contained: string
  disabled: string
  startIcon: string
  endIcon: string
  sizeSmall: string
  sizeMedium: string
  sizeLarge: string
}

export interface ButtonProps extends Omit<ButtonUnstyledProps, 'component'> {
  variant: TButtonVariant
  big?: boolean
  component?: 'button' | 'label'
}
