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
  '.highlightMarker': {
    position: 'absolute',
    backgroundColor: 'yellow',
  },

  '.ace_scroller': {
    cursor: 'pointer',
  },
  '.ace_line': {
    pointerEvents: 'auto',
    '&:hover': {
      backgroundColor: 'red',
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
