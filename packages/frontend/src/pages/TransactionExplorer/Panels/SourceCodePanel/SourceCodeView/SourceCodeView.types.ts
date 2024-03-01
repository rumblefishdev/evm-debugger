import type { AceEditorClickEvent } from '../../../../../components/AceEditor/AceEditor.types'

export interface ISourceCodeViewProps {
  contractName: string
  activeSourceCode: string
  startCodeLine: number
  endCodeLine: number
  currentSelectedLine: number | null
  lineRowsAvailableForSelections: number[]
  onClick: (event: AceEditorClickEvent) => void
  startCodeColumn: number
  endCodeColumn: number
}
