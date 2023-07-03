import React from 'react'

import { isTouchScreen } from '../../utils/touchScreenDetect'
import { submenusWhichAction } from '../../utils/SubmenusUtils'

import type { SubmenuInsideContainerProps } from './SubmenuInsideContainer.types'

export const SubmenuInsideContainer: React.FC<SubmenuInsideContainerProps> = ({
  children,
  onUnwantedTouch,
  onHoverStateChange,
  submenu,
}) => {
  return (
    <div
      onMouseEnter={() => {
        if (isTouchScreen()) onUnwantedTouch(true)
        onHoverStateChange(submenusWhichAction[submenu], true)
      }}
      onMouseLeave={() => {
        if (isTouchScreen()) onUnwantedTouch(true)
        onHoverStateChange(submenusWhichAction[submenu], false)
      }}
    >
      {children}
    </div>
  )
}
