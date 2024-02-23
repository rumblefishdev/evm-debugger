import { styled } from '@mui/material'
import React from 'react'
import AceEditor from 'react-ace'

import type { AceProps } from './AceEditor.types'

import 'ace-mode-solidity'
import 'ace-builds/src-noconflict/theme-dawn'

const Ace = React.forwardRef<AceEditor, AceProps>(({ aceTheme, ...props }, ref) => (
  <AceEditor
    {...props}
    theme={aceTheme}
    ref={ref}
  />
))

export const StyledAceEditor = styled(Ace)(({ theme }) => ({
  cursor: 'pointer',
  boxSizing: 'border-box',

  border: `1px solid ${theme.palette.rfLinesLight}`,
  '.selectedHighlightMarker': {
    position: 'absolute',
    backgroundColor: '#DEC792',
    '&:before': {
      zIndex: 100,
      width: '8px',
      top: '2px',
      right: '5px',
      position: 'absolute',
      height: '8px',
      content: '""',
      borderRadius: '50%',
      backgroundColor: 'green',
    },
  },

  '.highlightMarker': {
    position: 'absolute',
    backgroundColor: '#FFEAA7',
  },

  '.availableLinesHighlightMarker': {
    position: 'absolute',
    '&:before': {
      zIndex: 100,
      width: '8px',
      top: '1px',
      right: '4px',
      position: 'absolute',
      height: '8px',
      content: '""',
      borderRadius: '50%',
      border: '1px solid green',
    },
  },

  '.ace_scroller': {
    cursor: 'pointer',
  },
  '.ace_scrollbar': {
    ...theme.customStyles.scrollbar,
  },
  '.ace_line': {
    pointerEvents: 'auto',
    '&:hover': {
      backgroundColor: '#DEC792',
    },
  },
  '.ace_gutter-active-line': {
    cursor: 'pointer',
    background: 'unset',
  },
  '.ace_fold-widget': {
    display: 'none !important',
    cursor: 'pointer',
  },
  '.ace_cursor-layer': {
    display: 'none',
    cursor: 'pointer',
  },
  '.ace_active-line': {
    display: 'none',
    cursor: 'pointer',
  },
}))
