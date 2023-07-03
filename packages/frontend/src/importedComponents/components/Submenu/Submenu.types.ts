import type { DrawerProps } from '@mui/material'

export interface SubmenuProps extends DrawerProps {
  isOpen: boolean
  closeMenu: () => void
  setUnmounted?: (value: boolean) => void
  noPadding?: boolean
}
