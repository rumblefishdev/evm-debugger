import { Drawer } from '@mui/material'
import React from 'react'

import { PaperStyles, StyledBox } from './styles'
import type { SubmenuProps } from './Submenu.types'

export const Submenu: React.FC<SubmenuProps> = ({ children, isOpen, closeMenu, noPadding }) => {
  return (
    <Drawer
      anchor="top"
      open={isOpen}
      variant="temporary"
      sx={{ zIndex: 10 }}
      elevation={0}
      transitionDuration={{ exit: 350, enter: 350 }}
      onBackdropClick={closeMenu}
      PaperProps={{
        sx: PaperStyles,
      }}
      BackdropProps={{ sx: { background: 'rgba(0,0,0,0)' } }}
      ModalProps={{ keepMounted: true, disableScrollLock: true }}
    >
      <StyledBox noPadding={noPadding}>{children}</StyledBox>
    </Drawer>
  )
}
