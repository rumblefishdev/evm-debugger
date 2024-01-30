import type { TStructlogsPerStartLine } from '@evm-debuger/types'

export type TActiveLineState = { line: number; fileId: number; structlogsPerActiveLine: Record<string, TStructlogsPerStartLine> }
