import type { IAceEditorProps } from 'react-ace'

export type AceEditorClickEvent = {
  $pos: { row: number; column: number }
}
export interface AceEditorProps extends Omit<IAceEditorProps, 'theme'> {
  source: string
  highlightStartLine?: number
  highlightEndLine?: number
  onClick?: (event: AceEditorClickEvent) => void
}

export type AceProps = IAceEditorProps & { aceTheme: IAceEditorProps['theme'] }
