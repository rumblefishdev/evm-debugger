import { useSelector } from 'react-redux'
import React from 'react'
import { Button } from '../../../../components/UiButton'
import { Collapse, Stack } from '@mui/material'

import { StyledHeading, StyledHeadingWrapper } from '../styles'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { sourceFilesSelectors } from '../../../../store/sourceFiles/sourceFiles.selectors'
import { activeBlockSelectors } from '../../../../store/activeBlock/activeBlock.selector'

import { StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

interface ISourceCodePanel {
  hasContract?: boolean
}
export const SourceCodePanel: React.FC<ISourceCodePanel> = ({ hasContract }) => {
  const isContractVerified = useSelector(activeBlockSelectors.selectIsCurrentContractVerified)
  const hasMultipleSourceFiles = useSelector(sourceFilesSelectors.selectHasMultipleSourceFiles)
  const isInstructionsValid = useSelector(instructionsSelectors.selectIsCurrentInstructionsValid)

  const willShowSourceCode = isInstructionsValid && isContractVerified

  const [isTreeViewExpanded, setIsTreeViewExpanded] = React.useState<boolean>(hasMultipleSourceFiles)

  const handleCollapseButtonClick = () => {
    setIsTreeViewExpanded((prevState) => !prevState)
  }

  const treeFileButtonText = isTreeViewExpanded ? 'Collapse File Tree' : 'Expand File Tree'

  return (
    <StyledSourceCodePanel>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
      >
        <StyledHeadingWrapper>
          <StyledHeading>Source Code</StyledHeading>
          {hasMultipleSourceFiles && willShowSourceCode && (
            <Button
              onTouchStart={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              variant="text"
              size="medium"
              onClick={handleCollapseButtonClick}
            >
              {treeFileButtonText}
            </Button>
          )}
        </StyledHeadingWrapper>
      </Stack>
      <StyledSourceWrapper>
        {hasContract ? (
          willShowSourceCode ? (
            <>
              <Collapse
                in={isTreeViewExpanded && hasMultipleSourceFiles}
                orientation="horizontal"
              >
                <TreeFileViewContainer />
              </Collapse>
              <SourceCodeViewContainer />
            </>
          ) : (
            <p>No source code avalible for this contract!</p>
          )
        ) : (
          <p>Selected trace is not a contract!</p>
        )}
      </StyledSourceWrapper>
    </StyledSourceCodePanel>
  )
}
