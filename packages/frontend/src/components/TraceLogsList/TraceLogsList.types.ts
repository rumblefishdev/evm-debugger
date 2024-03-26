import type { TContractFunction } from '@evm-debuger/types'

import type { TMainTraceLogsWithId } from '../../store/traceLogs/traceLogs.types'

export type TTraceLogWithSignature = TMainTraceLogsWithId & { signature: string }

export type TTraceLogsListComponentProps = {
  traceLogs: TTraceLogWithSignature[]
  activeTraceLogIndex: number
  activateTraceLog: (traceLog: TMainTraceLogsWithId) => void
  activateStructLog: (structLogPc: number) => void
  currentInnerFunctions: TContractFunction[]
}
