import type { IAceEditorProps } from 'react-ace'

export type AceEditorClickEvent = {
  $pos: { row: number; column: number }
}
export interface AceEditorProps extends Omit<IAceEditorProps, 'theme'> {
  source: string
  highlightStartLine?: number
  highlightEndLine?: number
  highlightStartColumn?: number
  highlightEndColumn?: number
  currentSelectedLine?: number
  lineAvailableForSelection?: number[]
  onClick?: (event: AceEditorClickEvent) => void
}

export type AceProps = IAceEditorProps & { aceTheme: IAceEditorProps['theme'] }
