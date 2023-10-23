export interface VirtualizedListProps<T> {
  items: T[]
  children: (index: number, data: T) => React.ReactNode
}
