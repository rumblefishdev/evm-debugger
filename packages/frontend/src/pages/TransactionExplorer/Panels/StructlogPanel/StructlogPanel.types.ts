import type { VirtuosoHandle } from 'react-virtuoso'

import type { IExtendedStructLog } from '../../../../types'

export interface StructlogPanelProps {
  inGridLayout?: boolean
}
export interface StructlogPanelComponentProps {
  structlogs: IExtendedStructLog[]
  activeStructlogIndex: number
  handleSelect: (index: number) => void
  inGridLayout?: boolean
}

export type StructlogPanelComponentRef = {
  wrapperRef: HTMLDivElement
  listRef: VirtuosoHandle
}
