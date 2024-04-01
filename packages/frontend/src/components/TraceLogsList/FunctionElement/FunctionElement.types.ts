import type { TContractFunction } from '@evm-debuger/types'

export type TFunctionElementComponentProps = {
  functionBody: TContractFunction
  isActiveElement: boolean
  isActiveGroup: boolean
  activateTraceLog: (traceLogIndex: number) => void
  activateStructLog: (structlogIndex: number) => void
}
