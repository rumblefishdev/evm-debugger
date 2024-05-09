import type { IExtendedStructLog } from '../../../../../types'

export type TQuickLinksComponentProps = {
  externalCalls: IExtendedStructLog[]
  reverts: IExtendedStructLog[]
  expensiveOps: IExtendedStructLog[]
  activeStructLogIndex: number
  gasThreshold: number
  handleSetGasThreshold: (gasThreshold: number) => void
  setActiveStructlog: (structLogIndex: number, traceLogIndex: number) => void
}
