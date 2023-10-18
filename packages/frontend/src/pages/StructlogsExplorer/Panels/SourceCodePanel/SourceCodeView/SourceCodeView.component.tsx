import { StyledSyntaxHighlighter } from '../../../../../components/SourceCodeDisplayer/styles'

import type { ISourceCodeViewProps } from './SourceCodeView.types'
import { StyledSourceSection, StyledSourceSectionHeading } from './SourceCodeView.styles'

export const SourceCodeView: React.FC<ISourceCodeViewProps> = ({ activeSourceCode, endCodeLine, contractName, startCodeLine }) => {
  return (
    <StyledSourceSection>
      <StyledSourceSectionHeading variant="headingUnknown">{contractName}</StyledSourceSectionHeading>
      <StyledSyntaxHighlighter
        source={activeSourceCode}
        highlightStartLine={startCodeLine}
        highlightEndLine={endCodeLine}
      />
    </StyledSourceSection>
  )
}
