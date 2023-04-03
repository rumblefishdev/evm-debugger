import { CircularProgress, styled } from '@mui/material'
import type { CSSProperties, ReactElement } from 'react'
import { memo } from 'react'
import { Prism as ReactSyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

type ReactSyntaxHighlighterProps = {
  language: string
  style: Record<string, CSSProperties>
  renderer?: (props: unknown) => ReactElement
  children: string
}
type ReactSyntaxHighlighterComponent = (
  props: ReactSyntaxHighlighterProps,
) => ReactElement

const SyntaxHighlighterStyledComponent = styled(
  ReactSyntaxHighlighter as unknown as ReactSyntaxHighlighterComponent,
)(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(4)} !important`,
  margin: '0 !important',
  fontSize: '15px',
  borderRadius: '0 !important',
  borderLeft: 'none !important',
  border: `1px solid ${theme.palette.rfLinesLight}`,
}))

type SyntaxHighlighterProps = {
  source: string
}

const SyntaxHighlighter = ({ source }: SyntaxHighlighterProps) => {
  return (
    <SyntaxHighlighterStyledComponent language="solidity" style={oneLight}>
      {source}
    </SyntaxHighlighterStyledComponent>
  )
}

export const StyledSyntaxHighlighter = memo(SyntaxHighlighter)

export const StyledSelectWrap = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))

export const StyledLoading = styled(CircularProgress)(({ theme }) => ({
  margin: `${theme.spacing(40)} auto`,
}))
