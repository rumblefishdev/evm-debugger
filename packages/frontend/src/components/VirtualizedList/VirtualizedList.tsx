import React from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'

import type { VirtualizedListProps } from './VirtualizedList.types'
import { StyledVirtualizedList } from './VirtualizedList.styles'

// export const VirtualizedList = <T,>({ items, children }: VirtualizedListProps<T>) => {
//   return (
//     <StyledVirtualizedList
//       data={items}
//       itemContent={children}
//     />
//   )
// }

export const VirtualizedList = React.forwardRef<VirtuosoHandle, VirtualizedListProps<T>>((props, ref) => {
  const { items, children } = props
  return (
    <StyledVirtualizedList
      ref={ref}
      data={items}
      itemContent={children}
    />
  )
})
