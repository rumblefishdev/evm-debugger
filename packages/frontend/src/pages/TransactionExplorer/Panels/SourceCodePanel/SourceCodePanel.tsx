import { useSelector } from 'react-redux'

import { pageTexts } from '../../../../pageTexts'
import { StyledHeading, StyledHeadingWrapper } from '../styles'
import { sourceCodesSelectors } from '../../../../store/sourceCodes/sourceCodes.selectors'
import { sourceMapsSelectors } from '../../../../store/sourceMaps/sourceMaps.selectors'

import { NoSourceCodeHero, StyledSourceCodePanel, StyledSourceWrapper } from './SourceCodePanel.styles'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'

export const SourceCodePanel: React.FC = () => {
  const isSourceCodeAvailable = useSelector(sourceCodesSelectors.selectIsSourceCodeAvailable)
  const isSourceMapAvailable = useSelector(sourceMapsSelectors.selectIsCurrentSourceMapAvailable)
  const isAbleToDisplaySourceCodePanel = isSourceCodeAvailable && isSourceMapAvailable

  if (!isAbleToDisplaySourceCodePanel) return <NoSourceCodeHero variant="headingUnknown">{pageTexts.noSourceCode}</NoSourceCodeHero>

  return (
    <StyledSourceCodePanel>
      <StyledHeadingWrapper>
        <StyledHeading>Source Code</StyledHeading>
      </StyledHeadingWrapper>
      <StyledSourceWrapper>
        <TreeFileViewContainer />
        <SourceCodeViewContainer />
      </StyledSourceWrapper>
    </StyledSourceCodePanel>
  )
}
