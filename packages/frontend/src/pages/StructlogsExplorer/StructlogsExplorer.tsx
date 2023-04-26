import React from 'react'

import { TraceLogsList } from '../../components/TraceLogsList'
import { useTypedSelector } from '../../store/storeHooks'

import { BytecodePanel, StructlogPanel, InformationPanel } from './Panels'
import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, NotAContractHero } from './styles'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  const { isContract } = useTypedSelector((state) => state.activeBlock)

  return (
    <>
      <StyledContentWrapper {...props}>
        <TraceLogsList />
        {isContract ? (
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
