import React from 'react'
import type ReactAceEditor from 'react-ace'
import type { IMarker } from 'react-ace'

import { StyledAceEditor } from './AceEditor.styles'
import type { AceEditorProps } from './AceEditor.types'

export const AceEditor: React.FC<AceEditorProps> = ({ highlightStartLine, highlightEndLine, source, mode = 'json', ...props }) => {
  const editorRef = React.useRef<ReactAceEditor>(null)
  const shouldHighlight = highlightStartLine && highlightEndLine

  const highlightMarker: IMarker = React.useMemo(
    () => ({
      type: 'fullLine',
      startRow: highlightStartLine - 1,
      startCol: 1,
      endRow: highlightEndLine - 1,
      endCol: 0,
      className: 'highlightMarker',
    }),
    [highlightStartLine, highlightEndLine],
  )

  React.useEffect(() => {
    if (editorRef.current && highlightStartLine) {
      editorRef.current.editor.scrollToLine(highlightStartLine - 1, true, true, () => {})
    }
  }, [highlightStartLine])

  return (
    <StyledAceEditor
      ref={editorRef}
      height="100%"
      width="100%"
      aceTheme="dawn"
      name={React.useId()}
      value={source}
      readOnly
      markers={shouldHighlight && [highlightMarker]}
      mode={mode}
      {...props}
    />
  )
}
