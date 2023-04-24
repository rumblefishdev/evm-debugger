import { CircularProgress, styled } from '@mui/material'
import { useId, memo } from 'react'
import type { IAceEditorProps } from 'react-ace'
import AceEditor from 'react-ace'

import 'ace-mode-solidity'
import 'ace-builds/src-noconflict/theme-dawn'

type AceProps = IAceEditorProps & { aceTheme: IAceEditorProps['theme'] }
const Ace = ({ aceTheme, ...props }: AceProps) => (
  <AceEditor {...props} theme={aceTheme} />
)

const StyledAceEditor = styled(Ace)(({ theme }) => ({
  textarea: {
    display: 'none',
  },
  boxSizing: 'border-box',
  border: `1px solid ${theme.palette.rfLinesLight}`,
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
}

const ACE_LINE_HEIGHT = 16
const BORDER = 2

const SyntaxHighlighter = ({ source }: SyntaxHighlighterProps) => {
  const lines = source.split('\n')
  const textHeight = lines.length
  const height = textHeight * ACE_LINE_HEIGHT + BORDER
  return (
    <StyledAceEditor
      height={`${height}px`}
      mode="solidity"
      aceTheme="dawn"
      name={useId()}
      value={source}
      readOnly
      editorProps={{ $blockScrolling: true }}
    />
  )
}

export const StyledSyntaxHighlighter = memo(SyntaxHighlighter)

export const StyledSelectWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))

export const StyledLoading = styled(CircularProgress)<{
  dimensions?: [number, number]
}>(({ theme, dimensions }) => ({
  margin: dimensions
    ? `${dimensions[1] / 2}px ${dimensions[0] / 2}px`
    : `${theme.spacing(40)} auto`,
}))
