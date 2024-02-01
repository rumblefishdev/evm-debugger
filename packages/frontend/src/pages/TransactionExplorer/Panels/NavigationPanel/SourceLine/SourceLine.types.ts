export type TSourceLineComponentProps = {
  activeLineContent: string
  clearSelectedLine: () => void
  moveToNextAvailableLine: () => void
  moveToPreviousAvailableLine: () => void
  isNextLineAvailable: boolean
  isPreviousLineAvailable: boolean
  isNextStructlogAvailable: boolean
  isPreviousStructlogAvailable: boolean
  moveNextStructlog: () => void
  movePreviousStructlog: () => void
  areStructLogsAvailableForCurrentLine: boolean
}
