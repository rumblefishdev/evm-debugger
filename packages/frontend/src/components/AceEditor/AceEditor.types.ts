import type { IAceEditorProps } from 'react-ace'

export interface AceEditorProps extends Omit<IAceEditorProps, 'theme'> {
  source: string
  highlightStartLine?: number
  highlightEndLine?: number
}

export type AceProps = IAceEditorProps & { aceTheme: IAceEditorProps['theme'] }
