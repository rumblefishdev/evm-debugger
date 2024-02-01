import type { TStructlogsPerStartLine } from '@evm-debuger/types'

import type { TActiveLineState } from './activeLine.types'

export class ActiveLineState implements TActiveLineState {
  line: number | null
  fileId: number | null
  structlogsPerActiveLine: Record<string, TStructlogsPerStartLine>
  constructor(line: number | null, fileId: number | null, structlogsPerActiveLine: Record<string, TStructlogsPerStartLine> = {}) {
    this.line = line
    this.fileId = fileId
    this.structlogsPerActiveLine = structlogsPerActiveLine
  }
}
