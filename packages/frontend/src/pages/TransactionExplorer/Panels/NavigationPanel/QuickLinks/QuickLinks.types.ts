import type { IExtendedStructLog } from '../../../../../types'

export type TQuickLinksComponentProps = {
  externalCalls: IExtendedStructLog[]
  expensiveOps: IExtendedStructLog[]
  activeStructlog: IExtendedStructLog
  gasThreshold: number
  handleSetGasThreshold: (gasThreshold: number) => void
  setActiveStructlog: (structLog: number) => void
}
