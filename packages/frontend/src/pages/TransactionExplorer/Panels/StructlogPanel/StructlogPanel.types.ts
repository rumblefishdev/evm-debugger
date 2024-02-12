import type { VirtuosoHandle } from 'react-virtuoso'

import type { TStructlogWithListIndex } from '../../../../store/structlogs/structlogs.types'

export interface StructlogPanelComponentProps {
  structlogs: TStructlogWithListIndex[]
  activeStructlogIndex: number
  handleSelect: (structlog: TStructlogWithListIndex) => void
}

export type StructlogPanelComponentRef = {
  wrapperRef: HTMLDivElement
  listRef: VirtuosoHandle
}
