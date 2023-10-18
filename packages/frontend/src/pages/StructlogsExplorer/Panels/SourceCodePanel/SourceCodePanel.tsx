import { StyledHeading, StyledButton } from '../styles'

import { NoSourceCodeHero, StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import type { ISourceCodePanelComponentProps } from './SourceCodePanel.types'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

export const SourceCodePanel: React.FC<ISourceCodePanelComponentProps> = ({ close, isSourceCodeAvailable }) => {
  if (!isSourceCodeAvailable)
    return <NoSourceCodeHero variant="headingUnknown">No source code available for this contract</NoSourceCodeHero>

  return (
    <StyledSourceCodePanel>
      <StyledHeading>
        Source Code
        <StyledButton
          variant="text"
          onClick={close}
        >
          View bytecode
        </StyledButton>
      </StyledHeading>
      <StyledSourceWrapper>
        <TreeFileViewContainer />
        <SourceCodeViewContainer />
      </StyledSourceWrapper>
    </StyledSourceCodePanel>
  )
}
