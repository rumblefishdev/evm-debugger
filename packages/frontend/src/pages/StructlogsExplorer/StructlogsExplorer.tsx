import React from 'react'
import { useSelector } from 'react-redux'

import { TraceLogsList } from '../../components/TraceLogsList'
import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { useTypedSelector } from '../../store/storeHooks'
import { sourceCodesSelectors } from '../../store/sourceCodes/sourceCodes.selectors'

import { BytecodePanel, StructlogPanel, InformationPanel } from './Panels'
import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, StyledListsWrapper, NotAContractHero } from './styles'
import { SourceCodePanel } from './Panels/SourceCodePanel/SourceCodePanel'

export const StructlogsExplorer: React.FC<StructlogsExplorerProps> = (props) => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const source = useTypedSelector((state) => sourceCodesSelectors.selectByAddress(state, activeBlock.address))?.sourceCode
  const [isSourceView, setSourceView] = React.useState(false)
  const toggleSourceView = () => setSourceView((prev) => !prev)

  if (!activeBlock.isContract) return <NotAContractHero variant="headingUnknown">Selected Block is not a contract</NotAContractHero>

  return (
    <StyledContentWrapper {...props}>
      {isSourceView && <SourceCodePanel close={toggleSourceView} />}
      <StyledListsWrapper>
        <TraceLogsList />
        <StructlogPanel />
        {!isSourceView && (
          <BytecodePanel
            toggleSourceCodePanel={toggleSourceView}
            isSourceCodeAvailable={Boolean(source)}
          />
        )}

        <InformationPanel />
      </StyledListsWrapper>
    </StyledContentWrapper>
  )
}
