import type { TTraceLog } from '@evm-debuger/types'

export type TMainTraceLogsWithId = TTraceLog & {
  id: string
}
