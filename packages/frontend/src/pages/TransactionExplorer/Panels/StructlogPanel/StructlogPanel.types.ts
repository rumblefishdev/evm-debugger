import type { VirtuosoHandle } from 'react-virtuoso'

import type { IExtendedStructLog } from '../../../../types'

export interface StructlogPanelComponentProps {
  structlogs: IExtendedStructLog[]
  activeStructlogIndex: number
  handleSelect: (structlog: IExtendedStructLog & { listIndex: number }) => void
}

export type StructlogPanelComponentRef = {
  wrapperRef: HTMLDivElement
  listRef: VirtuosoHandle
}
