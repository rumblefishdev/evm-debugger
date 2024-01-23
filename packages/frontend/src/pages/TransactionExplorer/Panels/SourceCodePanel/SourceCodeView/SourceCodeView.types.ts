import type { AceEditorClickEvent } from '../../../../../components/AceEditor/AceEditor.types'

export interface ISourceCodeViewProps {
  contractName: string
  activeSourceCode: string
  startCodeLine: number
  endCodeLine: number
  onClick: (event: AceEditorClickEvent) => void
}
