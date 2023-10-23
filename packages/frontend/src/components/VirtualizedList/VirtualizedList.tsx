/* eslint-disable no-use-before-define */
import React from 'react'

import type { VirtualizedListType } from './VirtualizedList.types'
import { StyledVirtualizedList } from './VirtualizedList.styles'

export const VirtualizedList = React.forwardRef(({ items, children }, ref) => {
  return (
    <StyledVirtualizedList
      data={items}
      itemContent={children}
      ref={ref}
    />
  )
}) as VirtualizedListType
