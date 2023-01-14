import type { TypographyProps, LinkProps } from '@mui/material'

export interface MenuItemProps extends TypographyProps {
  to: string
  linkProps?: LinkProps
  noIcon?: boolean
}
