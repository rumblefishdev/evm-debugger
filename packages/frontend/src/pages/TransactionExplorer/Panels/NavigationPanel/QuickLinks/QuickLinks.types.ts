import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'

export type TQuickLinksComponentProps = {
  externalCalls: TStructlogWithListIndex[]
  expensiveOps: TStructlogWithListIndex[]
  activeStructlog: TStructlogWithListIndex
  gasThreshold: number
  handleSetGasThreshold: (gasThreshold: number) => void
  setActiveStructlog: (structLog: number) => void
}
