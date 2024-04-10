import React from 'react'
import { ViewportList } from 'react-viewport-list'
import type { ViewportListRef } from 'react-viewport-list'

import { EvmStepListElement } from '../../../../../components/EvmStepListElement'
import { StyledListWrapper } from '../../styles'

import { StyledTextField, StyledInfo, StyledHeadingWrapper, StyledQuickLinksHeading } from './QuickLinks.styles'
import type { TQuickLinksComponentProps } from './QuickLinks.types'

export const QuickLinksComponent: React.FC<TQuickLinksComponentProps> = ({
  externalCalls,
  activeStructlog,
  expensiveOps,
  gasThreshold,
  handleSetGasThreshold,
  setActiveStructlog,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const externalCallsListRef = React.useRef<ViewportListRef>(null)
  const expensiveOpsListRef = React.useRef<ViewportListRef>(null)

  return (
    <StyledListWrapper ref={ref}>
      <StyledHeadingWrapper>
        <StyledQuickLinksHeading>External calls</StyledQuickLinksHeading>
      </StyledHeadingWrapper>

      {externalCalls.length > 0 ? (
        <ViewportList
          ref={externalCallsListRef}
          viewportRef={ref}
          items={externalCalls}
        >
          {(item) => {
            const { gasCost, op, pc, index, dynamicGasCost } = item

            return (
              <EvmStepListElement
                key={index}
                baseGasCost={gasCost}
                dynamicGasCost={dynamicGasCost}
                opCode={op}
                pc={pc}
                isActive={index === activeStructlog?.index}
                onClick={() => setActiveStructlog(item.index)}
              />
            )
          }}
        </ViewportList>
      ) : (
        <StyledInfo>None were found</StyledInfo>
      )}

      <div style={{ width: '100%', minHeight: '20px' }} />
      <StyledHeadingWrapper>
        <StyledQuickLinksHeading>From gas cost</StyledQuickLinksHeading>
        <StyledTextField
          variant="standard"
          value={gasThreshold || ''}
          onChange={(event) => handleSetGasThreshold(Number(event.target.value))}
        />
      </StyledHeadingWrapper>

      {expensiveOps.length > 0 ? (
        <ViewportList
          ref={expensiveOpsListRef}
          viewportRef={ref}
          items={expensiveOps}
        >
          {(item) => {
            const { gasCost, op, pc, index, dynamicGasCost } = item

            return (
              <EvmStepListElement
                key={index}
                dynamicGasCost={dynamicGasCost}
                baseGasCost={gasCost}
                opCode={op}
                pc={pc}
                isActive={index === activeStructlog?.index}
                onClick={() => setActiveStructlog(item.index)}
              />
            )
          }}
        </ViewportList>
      ) : (
        <StyledInfo>None were found</StyledInfo>
      )}
    </StyledListWrapper>
  )
}
