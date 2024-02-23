import { useSelector } from 'react-redux'
import React from 'react'
import { Button } from '@rumblefishdev/ui/lib/src/components/AlgaeTheme/Button'
import { Stack } from '@mui/material'

import { StyledHeading, StyledHeadingWrapper } from '../styles'
import { sourceCodesSelectors } from '../../../../store/sourceCodes/sourceCodes.selectors'
import { sourceMapsSelectors } from '../../../../store/sourceMaps/sourceMaps.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { yulNodesSelectors } from '../../../../store/yulNodes/yulNodes.selectors'

import { StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'
import { YulNodesViewContainer } from './YulNodesView/YulNodesView.container'

interface ISourceCodePanel {
  hasContract?: boolean
}
export const SourceCodePanel: React.FC<ISourceCodePanel> = ({ hasContract }) => {
  const activeYulNode = useSelector(yulNodesSelectors.selectActiveYulNode)

  const [isYulView, setIsYulView] = React.useState(false)

  const isSourceCodeAvailable = useSelector(sourceCodesSelectors.selectIsSourceCodeAvailable)
  const isSourceMapAvailable = useSelector(sourceMapsSelectors.selectIsCurrentSourceMapAvailable)
  const hasMultipleSourceFiles = useSelector(sourceCodesSelectors.selectHasMultipleSourceFiles)
  const isInstructionsValid = useSelector(instructionsSelectors.selectIsCurrentInstructionsValid)
  const hasCurrentContractYulNodes = useSelector(yulNodesSelectors.selectCurrentHasYulNodes)

  const willShowSourceCode = isSourceCodeAvailable && isSourceMapAvailable && isInstructionsValid

  const [isTreeViewExpanded, setIsTreeViewExpanded] = React.useState<boolean>(hasMultipleSourceFiles)

  React.useEffect(() => {
    if (activeYulNode) {
      setIsYulView(true)
    }
    if (!activeYulNode) {
      setIsYulView(false)
    }
  }, [setIsYulView, activeYulNode])

  const handleCollapseButtonClick = () => {
    setIsTreeViewExpanded((prevState) => !prevState)
  }

  const toggleYulView = () => {
    setIsYulView((prevState) => !prevState)
  }

  const treeFileButtonText = isTreeViewExpanded ? 'Collapse File Tree' : 'Expand File Tree'
  const switchViewButtonText = isYulView ? 'Switch to source code view' : 'Switch to Yul View'

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
        <Button
          onTouchStart={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          variant="text"
          size="medium"
          onClick={toggleYulView}
          disabled={!hasCurrentContractYulNodes}
        >
          {switchViewButtonText}
        </Button>
      </Stack>
      <StyledSourceWrapper>
        {hasContract ? (
          isYulView && hasCurrentContractYulNodes ? (
            <YulNodesViewContainer />
          ) : willShowSourceCode ? (
            <>
              {isTreeViewExpanded && hasMultipleSourceFiles && <TreeFileViewContainer />}
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
