import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'

export type TSourceLineComponentProps = {
  activeLineContent: string
  currentStructLogsByBlocks: TStructlogWithListIndex[][]
  clearSelectedLine: () => void
  moveToNextAvailableLine: () => void
  moveToPreviousAvailableLine: () => void
  isNextLineAvailable: boolean
  isPreviousLineAvailable: boolean
  areStructLogsAvailableForCurrentLine: boolean
  setActiveStructlog: (structlog: TStructlogWithListIndex) => void
  activeStructlog: TStructlogWithListIndex | null
}
