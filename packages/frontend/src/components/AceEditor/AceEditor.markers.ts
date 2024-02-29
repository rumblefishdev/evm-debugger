import React from 'react'
import type { IMarker } from 'react-ace'

export type TUseMarkersProps = {
  lineAvailableForSelection: number[]
  highlightStartLine: number
  highlightEndLine: number
  currentSelectedLine: number
  highlightStartColumn: number
  highlightEndColumn: number
}

export const useMarkers = ({
  lineAvailableForSelection,
  highlightStartLine,
  highlightEndLine,
  currentSelectedLine,
  highlightEndColumn,
  highlightStartColumn,
}: TUseMarkersProps) => {
  const shouldHighlightActiveLine: IMarker = React.useMemo(
    () => ({
      type: 'fullLine',
      startRow: currentSelectedLine,
      startCol: 0,
      endRow: currentSelectedLine,
      endCol: 1,
      className: 'selectedHighlightMarker',
    }),
    [currentSelectedLine],
  )

  const highlightMarker: IMarker = React.useMemo(
    () => ({
      type: highlightStartLine === highlightEndLine ? 'text' : 'fullLine',
      startRow: highlightStartLine,
      startCol: highlightStartColumn,
      endRow: highlightEndLine,
      endCol: highlightEndColumn,
      className: 'highlightMarker',
    }),
    [highlightStartLine, highlightEndLine, highlightStartColumn, highlightEndColumn],
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

  return { shouldHighlightActiveLine, lineAvailableForSelectionMarker, highlightMarker }
}
