import React from 'react'
import { useSelector } from 'react-redux'

import { TraceLogsList } from '../../components/TraceLogsList'
import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'

import { BytecodePanel, StructlogPanel, InformationPanel } from './Panels'
import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, NotAContractHero } from './styles'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  return (
    <>
      <StyledContentWrapper {...props}>
        <TraceLogsList />
        {activeBlock.isContract ? (
          <>
            <StructlogPanel />
            <BytecodePanel />
            <InformationPanel />
          </>
        ) : (
          <NotAContractHero variant="headingUnknown">Selected Block is not a contract</NotAContractHero>
        )}
      </StyledContentWrapper>
    </>
  )
}
