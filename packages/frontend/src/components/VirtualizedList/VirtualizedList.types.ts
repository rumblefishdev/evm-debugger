import type { VirtuosoHandle } from 'react-virtuoso'

import type { StyledVirtualizedList } from './VirtualizedList.styles'

export interface VirtualizedListProps<T> {
  items: T[]
  children: (index: number, data: T) => React.ReactNode
}

export type VirtualizedListType = <T>(
  props: VirtualizedListProps<T> & { ref?: React.ForwardedRef<VirtuosoHandle> },
) => ReturnType<typeof StyledVirtualizedList>
