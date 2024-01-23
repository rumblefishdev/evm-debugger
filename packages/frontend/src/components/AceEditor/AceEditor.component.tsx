import React from 'react'
import type ReactAceEditor from 'react-ace'
import type { IMarker } from 'react-ace'

import { StyledAceEditor } from './AceEditor.styles'
import type { AceEditorClickEvent, AceEditorProps } from './AceEditor.types'

export const AceEditor: React.FC<AceEditorProps> = ({ highlightStartLine, highlightEndLine, source, mode = 'json', onClick, ...props }) => {
  const editorRef = React.useRef<ReactAceEditor>(null)
  const shouldHighlight = highlightStartLine && highlightEndLine

  const highlightMarker: IMarker = React.useMemo(
    () => ({
      type: 'fullLine',
      startRow: highlightStartLine,
      startCol: 1,
      endRow: highlightEndLine,
      endCol: 0,
      className: 'highlightMarker',
    }),
    [highlightStartLine, highlightEndLine],
  )

  React.useEffect(() => {
    if (editorRef.current && highlightStartLine) {
      editorRef.current.editor.scrollToLine(highlightStartLine, true, true, () => {})
    }
  }, [highlightStartLine])

  React.useEffect(() => {
    const editor = editorRef.current?.editor
    if (onClick) {
      editor.on('click', onClick)
    }
    return () => {
      if (onClick) {
        editor.off('click', onClick)
      }
    }
  }, [onClick])

  return (
    <StyledAceEditor
      ref={editorRef}
      height="100%"
      width="100%"
      aceTheme="dawn"
      name={React.useId()}
      value={source}
      readOnly={true}
      markers={shouldHighlight && [highlightMarker]}
      mode={mode}
      {...props}
    />
  )
}
