import React from 'react'
import { useSelector } from 'react-redux'

import { TraceLogsList } from '../../components/TraceLogsList'
import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { sourceCodesSelectors } from '../../store/sourceCodes/sourceCodes.selectors'
import { sourceMapsSelectors } from '../../store/sourceMaps/sourceMaps.selectors'

import { StructlogPanel, SourceCodePanel, BytecodePanel } from './Panels'
import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, StyledListsWrapper, NotAContractHero } from './StructlogsExplorer.styles'

export const StructlogsExplorer: React.FC<StructlogsExplorerProps> = (props) => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const isSourceCodeAvailable = useSelector(sourceCodesSelectors.selectIsSourceCodeAvailable)
  const isSourceMapAvailable = useSelector(sourceMapsSelectors.selectIsCurrentSourceMapAvailable)

  const [isSourceView, setSourceView] = React.useState(false)
  const toggleSourceView = () => setSourceView((prev) => !prev)

  const isAbleToDisplaySourceCodePanel = isSourceCodeAvailable && isSourceMapAvailable

  if (!activeBlock.isContract) return <NotAContractHero variant="headingUnknown">Selected Block is not a contract</NotAContractHero>

  return (
    <StyledContentWrapper {...props}>
      {isSourceView && (
        <SourceCodePanel
          close={toggleSourceView}
          isAbleToDisplaySourceCodePanel={isAbleToDisplaySourceCodePanel}
        />
      )}
      <StyledListsWrapper>
        <TraceLogsList />
        <StructlogPanel isSourceView={isSourceView} />
        {!isSourceView && (
          <BytecodePanel
            toggleSourceCodePanel={toggleSourceView}
            isAbleToDisplaySourceCodePanel={isAbleToDisplaySourceCodePanel}
          />
        )}
        {/* <InformationPanel /> */}
      </StyledListsWrapper>
    </StyledContentWrapper>
  )
}
