import type { TMainTraceLogs } from '@evm-debuger/types'

export type TMainTraceLogsWithId = TMainTraceLogs & {
  id: string
}
