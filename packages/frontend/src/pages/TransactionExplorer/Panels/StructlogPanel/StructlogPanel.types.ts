import type { VirtuosoHandle } from 'react-virtuoso'
import type { TDisassembledBytecode } from '@evm-debuger/types'

import type { IExtendedStructLog } from '../../../../types'

export interface StructlogPanelComponentProps {
  structlogs: IExtendedStructLog[]
  disassembledBytecode?: TDisassembledBytecode
  activeStructlog?: IExtendedStructLog
  handleSelect: (structlog: IExtendedStructLog) => void
}

export type StructlogPanelComponentRef = {
  wrapperRef: HTMLDivElement
  listRef: VirtuosoHandle
}
