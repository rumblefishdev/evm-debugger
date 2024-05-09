import type { VirtuosoHandle } from 'react-virtuoso'

import type { IExtendedStructLog } from '../../../../types'

export interface StructlogPanelComponentProps {
  structlogs: IExtendedStructLog[]
  activeStructlog?: IExtendedStructLog
  handleSelect: (structlog: IExtendedStructLog) => void
}

export type StructlogPanelComponentRef = {
  wrapperRef: HTMLDivElement
  listRef: VirtuosoHandle
}
