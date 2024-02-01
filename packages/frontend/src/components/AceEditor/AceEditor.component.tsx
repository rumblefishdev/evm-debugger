import React from 'react'
import type ReactAceEditor from 'react-ace'
import type { IMarker } from 'react-ace'

import { StyledAceEditor } from './AceEditor.styles'
import type { AceEditorProps } from './AceEditor.types'

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

  const shouldHighlightActiveLine: IMarker = React.useMemo(
    () => ({
      type: 'fullLine',
      startRow: currentSelectedLine,
      startCol: 1,
      endRow: currentSelectedLine,
      endCol: 0,
      className: 'selectedHighlightMarker',
    }),
    [currentSelectedLine],
  )

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

  const lineAvailableForSelectionMarker: IMarker[] = React.useMemo(
    () =>
      lineAvailableForSelection.map((line) => ({
        type: 'fullLine',
        startRow: line,
        startCol: 1,
        endRow: line,
        endCol: 0,
        className: 'availableLinesHighlightMarker',
      })),
    [lineAvailableForSelection],
  )

  console.log('lineAvailableForSelectionMarker', lineAvailableForSelectionMarker)

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
      items.push(highlightMarker)
    }

    if (currentSelectedLine) {
      items.push(shouldHighlightActiveLine)
    }

    if (lineAvailableForSelectionMarker.length > 0) {
      items.push(...lineAvailableForSelectionMarker)
    }

    return items
  }, [highlightMarker, shouldHighlight, shouldHighlightActiveLine, currentSelectedLine, lineAvailableForSelectionMarker])

  console.log('markers', markers)

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
