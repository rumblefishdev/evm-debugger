import { useSelector } from 'react-redux'

import { activeLineSelectors } from '../../../../store/activeLine/activeLine.selectors'
import { StyledHeading, StyledHeadingWrapper, StyledPanel } from '../styles'
import { activeBlockSelectors } from '../../../../store/activeBlock/activeBlock.selector'

import { SourceLineContainer } from './SourceLine/SourceLine.container'
import { QuickLinksContainer } from './QuickLinks/QuickLinks.container'

export const NavigationPanel: React.FC = () => {
  const isSourceCodeLineSelected = useSelector(activeLineSelectors.selectIsLineSelected)
  const isContractVerified = useSelector(activeBlockSelectors.selectIsCurrentContractVerified)
  return (
    <StyledPanel>
      <StyledHeadingWrapper>
        <StyledHeading>Navigation</StyledHeading>
      </StyledHeadingWrapper>
      {isSourceCodeLineSelected && isContractVerified ? <SourceLineContainer /> : <QuickLinksContainer />}
    </StyledPanel>
  )
}
