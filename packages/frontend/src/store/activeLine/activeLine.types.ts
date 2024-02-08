import type { TStructlogsPerStartLine } from '@evm-debuger/types'

export type TActiveLineState = {
  line: number | null
  structlogsPerActiveLine: Record<string, TStructlogsPerStartLine>
}
