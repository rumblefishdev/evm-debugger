import type { TDisassembledBytecodeStructlog } from '@evm-debuger/types'

export interface BytecodePanelComponentProps {
  dissasembledBytecode: TDisassembledBytecodeStructlog[]
  currentElementIndex: number
}
