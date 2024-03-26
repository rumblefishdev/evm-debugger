import type { TContractFunction } from '@evm-debuger/types'

import type { TMainTraceLogsWithId } from '../../../store/traceLogs/traceLogs.types'
import type { TTraceLogWithSignature } from '../TraceLogsList.types'

export type TTraceLogElementProps = {
  traceLog: TTraceLogWithSignature
  isActive: boolean
  innerFunctions?: TContractFunction[]
  activateTraceLog: (traceLog: TMainTraceLogsWithId) => void
  activateStructLog: (structLogPc: number) => void
}
