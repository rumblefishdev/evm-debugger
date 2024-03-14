import type { TDissasembledBytecodeStructlog } from '@evm-debuger/types'

export interface BytecodePanelComponentProps {
  dissasembledBytecode: TDissasembledBytecodeStructlog[]
  currentElementIndex: number
}
