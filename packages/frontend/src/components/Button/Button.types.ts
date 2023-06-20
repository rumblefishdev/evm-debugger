import type { ButtonUnstyledProps } from '@mui/base'

export type TButtonVariant = 'text' | 'outlined' | 'contained'

export interface ButtonProps extends Omit<ButtonUnstyledProps, 'component'> {
  variant: TButtonVariant
  big?: boolean
  sx?: object
  component?: 'button' | 'label'
}
