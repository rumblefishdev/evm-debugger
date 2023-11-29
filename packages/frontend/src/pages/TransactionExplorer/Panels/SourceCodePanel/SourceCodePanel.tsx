import { useSelector } from 'react-redux'
import React from 'react'

import { pageTexts } from '../../../../pageTexts'
import { StyledHeading, StyledHeadingWrapper } from '../styles'
import { sourceCodesSelectors } from '../../../../store/sourceCodes/sourceCodes.selectors'
import { sourceMapsSelectors } from '../../../../store/sourceMaps/sourceMaps.selectors'
import { Button } from '../../../../importedComponents/components/Button'

import { NoSourceCodeHero, StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

export const SourceCodePanel: React.FC = () => {
  const isSourceCodeAvailable = useSelector(sourceCodesSelectors.selectIsSourceCodeAvailable)
  const isSourceMapAvailable = useSelector(sourceMapsSelectors.selectIsCurrentSourceMapAvailable)
  const hasMultipleSourceFiles = useSelector(sourceCodesSelectors.selectHasMultipleSourceFiles)
  const isAbleToDisplaySourceCodePanel = isSourceCodeAvailable && isSourceMapAvailable

  const [isTreeViewExpanded, setIsTreeViewExpanded] = React.useState<boolean>(hasMultipleSourceFiles)

  const handleCollapseButtonClick = () => {
    setIsTreeViewExpanded((prevState) => !prevState)
  }

  if (!isAbleToDisplaySourceCodePanel) return <NoSourceCodeHero variant="headingUnknown">{pageTexts.noSourceCode}</NoSourceCodeHero>

  const treeFileButtonText = isTreeViewExpanded ? 'Collapse File Tree' : 'Expand File Tree'

  return (
    <StyledSourceCodePanel>
      <StyledHeadingWrapper>
        <StyledHeading>Source Code</StyledHeading>
        {hasMultipleSourceFiles && (
          <Button
            variant="text"
            size="medium"
            onClick={handleCollapseButtonClick}
          >
            {treeFileButtonText}
          </Button>
        )}
      </StyledHeadingWrapper>
      <StyledSourceWrapper
        onTouchStart={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {isTreeViewExpanded && <TreeFileViewContainer />}
        <SourceCodeViewContainer />
      </StyledSourceWrapper>
    </StyledSourceCodePanel>
  )
}
