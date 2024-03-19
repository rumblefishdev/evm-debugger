import type { TContractStructlogsPerStartLine } from '@evm-debuger/types'

import type { TActiveLineState } from './activeLine.types'

export class ActiveLineState implements TActiveLineState {
  line: number | null
  structlogsPerActiveLine: Record<string, TContractStructlogsPerStartLine>
  constructor(line: number | null, structlogsPerActiveLine: Record<string, TContractStructlogsPerStartLine> = {}) {
    this.line = line
    this.structlogsPerActiveLine = structlogsPerActiveLine
  }
}
