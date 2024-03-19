import type { TContractStructlogsPerStartLine } from '@evm-debuger/types'

export type TActiveLineState = {
  line: number | null
  structlogsPerActiveLine: Record<string, TContractStructlogsPerStartLine>
}
