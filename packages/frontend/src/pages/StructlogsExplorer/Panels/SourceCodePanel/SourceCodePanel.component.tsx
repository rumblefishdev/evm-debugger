import { StyledHeading, StyledButton } from '../styles'

import { StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import type { ISourceCodePanelComponentProps } from './SourceCodePanel.types'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

export const SourceCodePanelComponent: React.FC<ISourceCodePanelComponentProps> = ({ activeSourceCode, close, sourceFiles }) => {
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
        <TreeFileViewContainer sourceFiles={sourceFiles} />
        <SourceCodeViewContainer activeSourceCode={activeSourceCode} />
      </StyledSourceWrapper>
    </StyledSourceCodePanel>
  )
}
