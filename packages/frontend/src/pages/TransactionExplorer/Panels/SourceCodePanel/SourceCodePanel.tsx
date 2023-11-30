import { useSelector } from 'react-redux'
import React from 'react'

import { StyledHeading, StyledHeadingWrapper } from '../styles'
import { sourceCodesSelectors } from '../../../../store/sourceCodes/sourceCodes.selectors'
import { sourceMapsSelectors } from '../../../../store/sourceMaps/sourceMaps.selectors'
import { Button } from '../../../../importedComponents/components/Button'
import { GridLayoutHandler } from '../../../../components/GridLayout'

import { StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

interface ISourceCodePanel {
  inGridLayout?: boolean
  hasContract?: boolean
}
export const SourceCodePanel: React.FC<ISourceCodePanel> = ({ inGridLayout, hasContract }) => {
  const isSourceCodeAvailable = useSelector(sourceCodesSelectors.selectIsSourceCodeAvailable)
  const isSourceMapAvailable = useSelector(sourceMapsSelectors.selectIsCurrentSourceMapAvailable)
  const hasMultipleSourceFiles = useSelector(sourceCodesSelectors.selectHasMultipleSourceFiles)
  const hasSourceCode = isSourceCodeAvailable && isSourceMapAvailable
  const willShowSourceCode = hasSourceCode && hasContract

  const [isTreeViewExpanded, setIsTreeViewExpanded] = React.useState<boolean>(hasMultipleSourceFiles)

  const handleCollapseButtonClick = () => {
    setIsTreeViewExpanded((prevState) => !prevState)
  }

  const treeFileButtonText = isTreeViewExpanded ? 'Collapse File Tree' : 'Expand File Tree'

  return (
    <StyledSourceCodePanel>
      <StyledHeadingWrapper>
        <StyledHeading>Source Code</StyledHeading>
        {hasMultipleSourceFiles && (
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
        <div style={{ flex: 1 }} />
        {inGridLayout && <GridLayoutHandler />}
      </StyledHeadingWrapper>
      <StyledSourceWrapper>
        {willShowSourceCode && (
          <>
            {isTreeViewExpanded && <TreeFileViewContainer />}
            <SourceCodeViewContainer />
          </>
        )}
        {hasContract && !hasSourceCode && <p>No source code avalible for this contract!</p>}
        {!hasContract && <p>Selected trace is not a contract!</p>}
      </StyledSourceWrapper>
    </StyledSourceCodePanel>
  )
}
