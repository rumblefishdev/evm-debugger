import { styled } from '@mui/material'
import React from 'react'
import type { IAceEditorProps } from 'react-ace'
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

export const StyledAceEditor = styled(Ace)<{ mode: IAceEditorProps['mode'] }>(({ theme, mode }) => ({
  textarea: {
    display: 'none',
  },

  boxSizing: 'border-box',
  border: `1px solid ${theme.palette.rfLinesLight}`,

  '.highlightMarker': {
    position: 'absolute',
    backgroundColor: 'yellow',
  },

  '.ace_line': {
    ...(mode === 'json' && {
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
      lineHeight: '21px',
      fontFamily: 'Ibm Plex Mono',
      ...theme.typography.bodySmall,
      color: theme.palette.rfSecondary,
    }),
    ...(mode === 'plain_text' && {
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
      lineHeight: '21px',
      fontFamily: 'monospace',
      ...theme.typography.bodySmall,
      color: theme.palette.rfSecondary,
    }),
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
