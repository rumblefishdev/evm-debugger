import { Button } from '@mui/material'

import { pageTexts } from '../../../../pageTexts'
import { StyledHeading, StyledButton } from '../styles'

import { NoSourceCodeHero, StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import type { ISourceCodePanelComponentProps } from './SourceCodePanel.types'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

export const SourceCodePanel: React.FC<ISourceCodePanelComponentProps> = ({ close, isAbleToDisplaySourceCodePanel }) => {
  if (!isAbleToDisplaySourceCodePanel)
    return (
      <NoSourceCodeHero variant="headingUnknown">
        {pageTexts.noSourceCode}
        <Button onClick={close}>Close</Button>
      </NoSourceCodeHero>
    )

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
