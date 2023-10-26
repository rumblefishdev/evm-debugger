import { Button } from '../../../../components/Button'
import { pageTexts } from '../../../../pageTexts'
import { StyledHeading, StyledHeadingWrapper } from '../styles'

import { NoSourceCodeHero, StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import type { ISourceCodePanelComponentProps } from './SourceCodePanel.types'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

export const SourceCodePanel: React.FC<ISourceCodePanelComponentProps> = ({ close, isAbleToDisplaySourceCodePanel }) => {
  if (!isAbleToDisplaySourceCodePanel)
    return (
      <NoSourceCodeHero variant="headingUnknown">
        {pageTexts.noSourceCode}
        <Button
          variant="text"
          onClick={close}
        >
          Close
        </Button>
      </NoSourceCodeHero>
    )

  return (
    <StyledSourceCodePanel>
      <StyledHeadingWrapper>
        <StyledHeading>Source Code</StyledHeading>
        <Button
          big
          variant="text"
          onClick={close}
        >
          View bytecode
        </Button>
      </StyledHeadingWrapper>
      <StyledSourceWrapper>
        <TreeFileViewContainer />
        <SourceCodeViewContainer />
      </StyledSourceWrapper>
    </StyledSourceCodePanel>
  )
}
