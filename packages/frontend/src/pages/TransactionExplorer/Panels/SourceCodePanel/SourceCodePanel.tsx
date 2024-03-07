import { useSelector } from 'react-redux'
import React from 'react'
import { Button } from '@rumblefishdev/ui/lib/src/components/AlgaeTheme/Button'
import { Collapse, Stack } from '@mui/material'

import { StyledHeading, StyledHeadingWrapper } from '../styles'
import { sourceCodesSelectors } from '../../../../store/sourceCodes/sourceCodes.selectors'
import { sourceMapsSelectors } from '../../../../store/sourceMaps/sourceMaps.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'

import { StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

interface ISourceCodePanel {
  hasContract?: boolean
}
export const SourceCodePanel: React.FC<ISourceCodePanel> = ({ hasContract }) => {
  const isSourceCodeAvailable = useSelector(sourceCodesSelectors.selectIsSourceCodeAvailable)
  const isSourceMapAvailable = useSelector(sourceMapsSelectors.selectIsCurrentSourceMapAvailable)
  const hasMultipleSourceFiles = useSelector(sourceCodesSelectors.selectHasMultipleSourceFiles)
  const isInstructionsValid = useSelector(instructionsSelectors.selectIsCurrentInstructionsValid)

  const willShowSourceCode = isSourceCodeAvailable && isSourceMapAvailable && isInstructionsValid

  const [isTreeViewExpanded, setIsTreeViewExpanded] = React.useState<boolean>(hasMultipleSourceFiles)

  const handleCollapseButtonClick = () => {
    setIsTreeViewExpanded((prevState) => !prevState)
  }

  const treeFileButtonText = isTreeViewExpanded ? 'Collapse File Tree' : 'Expand File Tree'

  console.log('SourceCodePanel', {
    willShowSourceCode,
    treeFileButtonText,
    isTreeViewExpanded,
    isSourceMapAvailable,
    isSourceCodeAvailable,
    isInstructionsValid,
    hasMultipleSourceFiles,
    hasContract,
  })

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
