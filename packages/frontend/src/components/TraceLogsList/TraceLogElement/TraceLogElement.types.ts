import type { TStructlogWithListIndex } from '../../../store/structlogs/structlogs.types'
import type { TMainTraceLogsWithId } from '../../../store/traceLogs/traceLogs.types'
import type { TInnerFunction, TTraceLogWithSignature } from '../TraceLogsList.types'

export type TTraceLogElementProps = {
  traceLog: TTraceLogWithSignature
  isActive: boolean
  innerFunctions?: TInnerFunction[]
  activateTraceLog: (traceLog: TMainTraceLogsWithId) => void
  activateStructLog: (structLog: TStructlogWithListIndex) => void
}
