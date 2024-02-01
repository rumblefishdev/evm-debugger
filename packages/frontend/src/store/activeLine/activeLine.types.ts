import type { TStructlogsPerStartLine } from '@evm-debuger/types'

export type TActiveLineState = {
  line: number | null
  fileId: number | null
  structlogsPerActiveLine: Record<string, TStructlogsPerStartLine>
}
