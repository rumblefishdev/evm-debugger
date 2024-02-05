import { useSelector } from 'react-redux'

import { activeLineSelectors } from '../../../../store/activeLine/activeLine.selectors'
import { StyledHeading, StyledHeadingWrapper, StyledPanel } from '../styles'

import { SourceLineContainer } from './SourceLine/SourceLine.container'
import { QuickLinksContainer } from './QuickLinks/QuickLinks.container'

export const NavigationPanel: React.FC = () => {
  const isSourceCodeLineSelected = useSelector(activeLineSelectors.selectIsLineSelected)

  return (
    <StyledPanel>
      <StyledHeadingWrapper>
        <StyledHeading>Navigation</StyledHeading>
      </StyledHeadingWrapper>
      {isSourceCodeLineSelected ? <SourceLineContainer /> : <QuickLinksContainer />}
    </StyledPanel>
  )
}
