import type { VirtuosoHandle } from 'react-virtuoso'
import type { TDisassembledBytecode } from '@evm-debuger/types'

import type { TStructlogWithListIndex } from '../../../../store/structlogs/structlogs.types'

export interface StructlogPanelComponentProps {
  structlogs: TStructlogWithListIndex[]
  disassembledBytecode?: TDisassembledBytecode
  activeStructlog?: TStructlogWithListIndex
  handleSelect: (structlog: number) => void
}

export type StructlogPanelComponentRef = {
  wrapperRef: HTMLDivElement
  listRef: VirtuosoHandle
}
