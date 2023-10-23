import type { VirtuosoHandle } from 'react-virtuoso'

import type { IExtendedStructLog } from '../../../../types'

export interface StructlogPanelComponentProps {
  structlogs: IExtendedStructLog[]
  activeStructlogIndex: number
  handleSelect: (index: number) => void
}

export type StructlogPanelComponentRef = {
  wrapperRef: HTMLDivElement
  listRef: VirtuosoHandle
}
