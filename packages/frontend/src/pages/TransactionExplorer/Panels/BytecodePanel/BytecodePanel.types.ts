import type { TDisassembledBytecode } from '../../../../store/bytecodes/bytecodes.types'

export interface BytecodePanelComponentProps {
  dissasembledBytecode: TDisassembledBytecode[]
  currentElementIndex: number
}
