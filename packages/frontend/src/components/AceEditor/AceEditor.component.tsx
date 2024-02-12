import React from 'react'
import type ReactAceEditor from 'react-ace'
import type { IMarker } from 'react-ace'

import { StyledAceEditor } from './AceEditor.styles'
import type { AceEditorProps } from './AceEditor.types'
import { useMarkers } from './AceEditor.markers'

export const AceEditor: React.FC<AceEditorProps> = ({
  highlightStartLine,
  currentSelectedLine,
  highlightEndLine,
  lineAvailableForSelection,
  source,
  mode = 'json',
  onClick,
  ...props
}) => {
  const editorRef = React.useRef<ReactAceEditor>(null)
  const shouldHighlight = highlightStartLine && highlightEndLine

  const MARKERS = useMarkers({
    lineAvailableForSelection,
    highlightStartLine,
    highlightEndLine,
    currentSelectedLine,
  })

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

  const markers: IMarker[] = React.useMemo(() => {
    const items: IMarker[] = []

    if (shouldHighlight) {
      items.push(MARKERS.highlightMarker)
    }

    if (currentSelectedLine) {
      items.push(MARKERS.shouldHighlightActiveLine)
    }

    if (MARKERS.lineAvailableForSelectionMarker.length > 0) {
      items.push(...MARKERS.lineAvailableForSelectionMarker)
    }

    return items
  }, [shouldHighlight, currentSelectedLine, MARKERS])

  return (
    <StyledAceEditor
      ref={editorRef}
      height="100%"
      width="100%"
      aceTheme="dawn"
      name={React.useId()}
      value={source}
      readOnly={true}
      markers={markers}
      mode={mode}
      {...props}
    />
  )
}
