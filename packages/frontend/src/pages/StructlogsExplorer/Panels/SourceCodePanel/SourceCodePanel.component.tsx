import { StyledHeading, StyledButton } from '../styles'

import { StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import type { ISourceCodePanelComponentProps } from './SourceCodePanel.types'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

export const SourceCodePanelComponent: React.FC<ISourceCodePanelComponentProps> = ({ close }) => {
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
