import type { ForwardedRef } from 'react'

import type { TDisassembledBytecode } from '../../../../store/bytecodes/bytecodes.types'

export interface BytecodePanelProps {
  toggleSourceCodePanel: () => void
  isSourceCodeAvailable: boolean
}

export interface BytecodePanelContainerProps {
  toggleSourceCodePanel: () => void
  isSourceCodeAvailable: boolean
}
export interface BytecodePanelComponentProps extends BytecodePanelContainerProps {
  dissasembledBytecode: TDisassembledBytecode[]
  activeStructlogPc: number
}
