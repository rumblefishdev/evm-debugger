import type { TStructlogWithListIndex } from '../../store/structlogs/structlogs.types'
import type { TMainTraceLogsWithId } from '../../store/traceLogs/traceLogs.types'

export type TTraceLogWithSignature = TMainTraceLogsWithId & { signature: string }

export type TInnerFunction = {
  structLog: TStructlogWithListIndex
  sourceFunctionSingature: string
}

export type TTraceLogsListComponentProps = {
  traceLogs: TTraceLogWithSignature[]
  activeTraceLogIndex: number
  activateTraceLog: (traceLog: TMainTraceLogsWithId) => void
  activateStructLog: (structLog: TStructlogWithListIndex) => void
  currentInnerFunctions: TInnerFunction[]
}
