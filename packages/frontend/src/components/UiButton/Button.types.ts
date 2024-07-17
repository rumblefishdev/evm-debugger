import type { ButtonProps as MuiButtonProps } from '@mui/material';
import type { TypographyOwnProps } from '@mui/material/Typography/Typography';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: MuiButtonProps['variant'] | 'flat' | 'link' | 'icon';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  iconDirection?: 'left' | 'right';
  link?: string;
  typographyProps?: TypographyOwnProps;
  fontColor?: string;
}
