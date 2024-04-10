import type { IExtendedStructLog } from '../../../../../types'

export type TSourceLineComponentProps = {
  activeLineContent: string
  currentStructLogsByBlocks: IExtendedStructLog[][]
  areStructLogsAvailableForCurrentLine: boolean
  activeStructlog: IExtendedStructLog | null
  isNextLineAvailable: boolean
  isPreviousLineAvailable: boolean
  clearSelectedLine: () => void
  setActiveStructlog: (structlog: IExtendedStructLog) => void
  moveToNextAvailableLine: () => void
  moveToPreviousAvailableLine: () => void
}
