import React from 'react'

import { isTouchScreen } from '../../utils/touchScreenDetect'

import type { MenuItemWithCollapseProps } from './MenuItemWithCollapse.types'

export const MenuItemWithCollapse: React.FC<MenuItemWithCollapseProps> = ({
  children,
  onSubmenuChange,
  onSubmenuClose,
  submenu,
  state,
}) => {
  return (
    <div
      onTouchStart={() => {
        if (!isTouchScreen()) return
        if (!state.currentSubmenu) onSubmenuChange(submenu)
        else onSubmenuClose(submenu)
      }}
      onMouseEnter={() => {
        onSubmenuChange(submenu)
      }}
      onMouseLeave={() => {
        onSubmenuClose(submenu)
      }}
    >
      {children}
    </div>
  )
}
