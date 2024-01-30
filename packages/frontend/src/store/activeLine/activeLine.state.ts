import type { TStructlogsPerStartLine } from '@evm-debuger/types'

import type { TActiveLineState } from './activeLine.types'

export class ActiveLineState implements TActiveLineState {
  line: number
  fileId: number
  structlogsPerActiveLine: Record<string, TStructlogsPerStartLine>
  constructor(line: number, fileId: number, structlogsPerActiveLine: Record<string, TStructlogsPerStartLine> = {}) {
    this.line = line
    this.fileId = fileId
    this.structlogsPerActiveLine = {}
  }
}
