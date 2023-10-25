import { Stack } from '@mui/material'

import { SyntaxHighlighter } from '../../../../../components/SourceCodeDisplayer/styles'

import type { ISourceCodeViewProps } from './SourceCodeView.types'
import { StyledSourceSection, StyledSourceSectionHeading } from './SourceCodeView.styles'

export const SourceCodeView: React.FC<ISourceCodeViewProps> = ({ activeSourceCode, endCodeLine, contractName, startCodeLine }) => {
  return (
    <Stack
      height="100%"
      width="70%"
    >
      <StyledSourceSectionHeading variant="headingUnknown">{contractName}</StyledSourceSectionHeading>
      <StyledSourceSection>
        <SyntaxHighlighter
          source={activeSourceCode}
          highlightStartLine={startCodeLine}
          highlightEndLine={endCodeLine}
        />
      </StyledSourceSection>
    </Stack>
  )
}
