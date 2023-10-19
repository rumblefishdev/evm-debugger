import React from 'react'
import { useSelector } from 'react-redux'

import { TraceLogsList } from '../../components/TraceLogsList'
import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { sourceCodesSelectors } from '../../store/sourceCodes/sourceCodes.selectors'

import { StructlogPanel, InformationPanel, SourceCodePanel, BytecodePanel } from './Panels'
import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, StyledListsWrapper, NotAContractHero } from './StructlogsExplorer.styles'

export const StructlogsExplorer: React.FC<StructlogsExplorerProps> = (props) => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const isSourceCodeAvailable = useSelector(sourceCodesSelectors.selectIsSourceCodePresent)
  const [isSourceView, setSourceView] = React.useState(false)
  const toggleSourceView = () => setSourceView((prev) => !prev)

  if (!activeBlock.isContract) return <NotAContractHero variant="headingUnknown">Selected Block is not a contract</NotAContractHero>

  return (
    <StyledContentWrapper {...props}>
      {isSourceView && (
        <SourceCodePanel
          close={toggleSourceView}
          isSourceCodeAvailable={isSourceCodeAvailable}
        />
      )}
      <StyledListsWrapper>
        <TraceLogsList />
        <StructlogPanel />
        {!isSourceView && (
          <BytecodePanel
            toggleSourceCodePanel={toggleSourceView}
            isSourceCodeAvailable={isSourceCodeAvailable}
          />
        )}
        <InformationPanel />
      </StyledListsWrapper>
    </StyledContentWrapper>
  )
}
