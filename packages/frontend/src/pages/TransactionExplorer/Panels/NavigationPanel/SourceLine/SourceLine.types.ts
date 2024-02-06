import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'

export type TSourceLineComponentProps = {
  activeLineContent: string
  currentStructLogsByBlocks: TStructlogWithListIndex[][]
  areStructLogsAvailableForCurrentLine: boolean
  activeStructlog: TStructlogWithListIndex | null
  isNextLineAvailable: boolean
  isPreviousLineAvailable: boolean
  clearSelectedLine: () => void
  setActiveStructlog: (structlog: TStructlogWithListIndex) => void
  moveToNextAvailableLine: () => void
  moveToPreviousAvailableLine: () => void
}
