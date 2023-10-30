import { Stack } from '@mui/material'

import { AceEditor } from '../../../../../components/AceEditor'

import type { ISourceCodeViewProps } from './SourceCodeView.types'
import { StyledSourceSection, StyledSourceSectionHeading } from './SourceCodeView.styles'

export const SourceCodeView: React.FC<ISourceCodeViewProps> = ({ activeSourceCode, endCodeLine, contractName, startCodeLine }) => {
  return (
    <Stack
      height="100%"
      width="100%"
    >
      <StyledSourceSectionHeading variant="headingUnknown">{contractName}</StyledSourceSectionHeading>
      <StyledSourceSection>
        <AceEditor
          source={activeSourceCode}
          highlightStartLine={startCodeLine}
          highlightEndLine={endCodeLine}
          mode="solidity"
        />
      </StyledSourceSection>
    </Stack>
  )
}
