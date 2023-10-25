import { styled } from '@mui/material'
import React, { useId, useEffect } from 'react'
import type { IAceEditorProps, IMarker } from 'react-ace'
import AceEditor from 'react-ace'

import 'ace-mode-solidity'
import 'ace-builds/src-noconflict/theme-dawn'

type AceProps = IAceEditorProps & { aceTheme: IAceEditorProps['theme'] }
const Ace = React.forwardRef<AceEditor, AceProps>(({ aceTheme, ...props }, ref) => (
  <AceEditor
    {...props}
    theme={aceTheme}
    ref={ref}
  />
))

const StyledAceEditor = styled(Ace)(({ theme }) => ({
  textarea: {
    display: 'none',
  },
  boxSizing: 'border-box',

  border: `1px solid ${theme.palette.rfLinesLight}`,

  '.highlightMarker': {
    position: 'absolute',
    backgroundColor: 'yellow',
  },
  '.ace_gutter-active-line': {
    background: 'unset',
  },
  '.ace_fold-widget': {
    display: 'none !important',
  },
  '.ace_cursor-layer': {
    display: 'none',
  },

  '.ace_active-line': {
    display: 'none',
  },
}))

type SyntaxHighlighterProps = {
  source: string
  highlightStartLine?: number
  highlightEndLine?: number
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ source, highlightStartLine, highlightEndLine }) => {
  const editorRef = React.useRef<AceEditor>(null)

  // Temporary solution for mismatching line numbers between Ace and Analyzer output
  const highlightMarker: IMarker = {
    type: 'fullLine',
    startRow: highlightStartLine - 1,
    startCol: 1,
    endRow: highlightEndLine - 1,
    endCol: 0,
    // eslint-disable-next-line unicorn/no-keyword-prefix -- Ace require to provide className in that form
    className: 'highlightMarker',
  }

  useEffect(() => {
    if (editorRef.current && highlightStartLine) {
      console.log('scrolling to line', highlightStartLine)
      editorRef.current.editor.scrollToLine(highlightStartLine - 1, true, true, () => {})
    }
  }, [highlightStartLine])

  return (
    <StyledAceEditor
      ref={editorRef}
      height="100%"
      width="100%"
      mode="solidity"
      aceTheme="dawn"
      name={useId()}
      value={source}
      readOnly
      markers={[highlightMarker]}
    />
  )
}

export const StyledSelectWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))
