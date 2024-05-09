import React from 'react'
import { Tab, Tabs } from '@mui/material'

import { EvmStepListElement } from '../../../../../components/EvmStepListElement'
import { StyledListWrapper } from '../../styles'
import { VirtualizedList } from '../../../../../components/VirtualizedList/VirtualizedList'

import { StyledTextField, StyledInfo, StyledHeadingWrapper, StyledQuickLinksHeading } from './QuickLinks.styles'
import type { TQuickLinksComponentProps } from './QuickLinks.types'

export const RenderQuickLinksTab: React.FC<TQuickLinksComponentProps & { activeTabValue: number }> = ({
  activeStructLogIndex,
  externalCalls,
  expensiveOps,
  gasThreshold,
  handleSetGasThreshold,
  reverts,
  activeTabValue,
  setActiveStructlog,
}) => {
  switch (activeTabValue) {
    case 0:
      return (
        <>
          <StyledHeadingWrapper>
            <StyledQuickLinksHeading>From gas cost</StyledQuickLinksHeading>
            <StyledTextField
              variant="standard"
              value={gasThreshold || ''}
              onChange={(event) => handleSetGasThreshold(Number(event.target.value))}
            />
          </StyledHeadingWrapper>
          {expensiveOps.length > 0 ? (
            <VirtualizedList items={expensiveOps}>
              {(listIndex, item) => {
                const { gasCost, op, pc, index, dynamicGasCost } = item

                return (
                  <EvmStepListElement
                    key={listIndex}
                    id={`expensive-ops-${listIndex}`}
                    dynamicGasCost={dynamicGasCost}
                    baseGasCost={gasCost}
                    opCode={op}
                    pc={pc}
                    isActive={index === activeStructLogIndex}
                    onClick={() => setActiveStructlog(item.index, item.traceLogIndex)}
                  />
                )
              }}
            </VirtualizedList>
          ) : (
            <StyledInfo>None were found</StyledInfo>
          )}
        </>
      )
    case 1:
      return (
        <>
          <StyledHeadingWrapper>
            <StyledQuickLinksHeading>Reverts</StyledQuickLinksHeading>
          </StyledHeadingWrapper>
          {reverts.length > 0 && (
            <VirtualizedList items={reverts}>
              {(listIndex, item) => {
                const { gasCost, op, pc, index, dynamicGasCost } = item

                return (
                  <EvmStepListElement
                    key={listIndex}
                    id={`revert-${listIndex}`}
                    baseGasCost={gasCost}
                    dynamicGasCost={dynamicGasCost}
                    opCode={op}
                    pc={pc}
                    isActive={index === activeStructLogIndex}
                    onClick={() => setActiveStructlog(item.index, item.traceLogIndex)}
                  />
                )
              }}
            </VirtualizedList>
          )}
        </>
      )
    case 2:
      return (
        <>
          <StyledHeadingWrapper>
            <StyledQuickLinksHeading>External calls</StyledQuickLinksHeading>
          </StyledHeadingWrapper>
          {externalCalls.length > 0 && (
            <VirtualizedList items={externalCalls}>
              {(listIndex, item) => {
                const { gasCost, op, pc, index, dynamicGasCost } = item

                return (
                  <EvmStepListElement
                    key={listIndex}
                    id={`external-calls-${listIndex}`}
                    baseGasCost={gasCost}
                    dynamicGasCost={dynamicGasCost}
                    opCode={op}
                    pc={pc}
                    isActive={index === activeStructLogIndex}
                    onClick={() => setActiveStructlog(item.index, item.traceLogIndex)}
                  />
                )
              }}
            </VirtualizedList>
          )}
        </>
      )
    default:
      return null
  }
}

export const QuickLinksComponent: React.FC<TQuickLinksComponentProps> = ({
  externalCalls,
  reverts,
  activeStructLogIndex,
  expensiveOps,
  gasThreshold,
  handleSetGasThreshold,
  setActiveStructlog,
}) => {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <StyledListWrapper gap={2}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
      >
        <Tab
          label="From gas cost"
          disableFocusRipple
          disableRipple
          disableTouchRipple
        />
        <Tab
          label="Reverts"
          disabled={reverts?.length === 0}
          disableFocusRipple
          disableRipple
          disableTouchRipple
        />
        <Tab
          label="External calls"
          disabled={externalCalls?.length === 0}
          disableFocusRipple
          disableRipple
          disableTouchRipple
        />
      </Tabs>
      <RenderQuickLinksTab
        activeStructLogIndex={activeStructLogIndex}
        externalCalls={externalCalls}
        expensiveOps={expensiveOps}
        gasThreshold={gasThreshold}
        handleSetGasThreshold={handleSetGasThreshold}
        reverts={reverts}
        activeTabValue={activeTab}
        setActiveStructlog={setActiveStructlog}
      />
    </StyledListWrapper>
  )
}
