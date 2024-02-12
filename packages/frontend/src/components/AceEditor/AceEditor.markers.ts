import React from 'react'
import type { IMarker } from 'react-ace'

export type TUseMarkersProps = {
  lineAvailableForSelection: number[]
  highlightStartLine: number
  highlightEndLine: number
  currentSelectedLine: number
}

export const useMarkers = ({ lineAvailableForSelection, highlightStartLine, highlightEndLine, currentSelectedLine }: TUseMarkersProps) => {
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

  return { shouldHighlightActiveLine, lineAvailableForSelectionMarker, highlightMarker }
}
