import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'

export type TSourceLineComponentProps = {
  activeLineContent: string
  currentStructLogsByBlocks: TStructlogWithListIndex[][]
  clearSelectedLine: () => void
  areStructLogsAvailableForCurrentLine: boolean
  setActiveStructlog: (structlog: TStructlogWithListIndex) => void
  activeStructlog: TStructlogWithListIndex | null
}
