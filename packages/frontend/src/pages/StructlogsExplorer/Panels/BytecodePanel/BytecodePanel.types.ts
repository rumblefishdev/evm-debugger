import type { TDisassembledBytecode } from '../../../../store/bytecodes/bytecodes.types'

export interface BytecodePanelContainerProps {
  toggleSourceCodePanel: () => void
  isAbleToDisplaySourceCodePanel: boolean
}
export interface BytecodePanelComponentProps extends BytecodePanelContainerProps {
  dissasembledBytecode: TDisassembledBytecode[]
  activeStructlogPc: number
}
