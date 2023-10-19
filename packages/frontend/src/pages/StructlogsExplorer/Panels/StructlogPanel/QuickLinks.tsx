import { useRef, useState } from 'react'
import type { ReactElement } from 'react'
import ViewportList from 'react-viewport-list'
import type { ViewportListRef } from 'react-viewport-list'
import { checkIfOfCreateOrCallType } from '@evm-debuger/analyzer/dist/helpers/helpers'
import type { TReturnedTraceLog } from '@evm-debuger/types'
import { useSelector } from 'react-redux'

import { StyledHeading, StyledListWrapper } from '../styles'
import { ExplorerListRow } from '../../../../components/ExplorerListRow'
import type { IExtendedStructLog } from '../../../../types'
import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'

import { StyledCollapse, StyledInput, StyledInfo, StyledHeadingWrapper, StyledQuickLinksHeading } from './styles'

export type QuickLinksProps = {
  isOpen: boolean
  selectStructLog: (structLog: IExtendedStructLog) => void
}

export function QuickLinks({ selectStructLog, isOpen }: QuickLinksProps): ReactElement {
  const [gasThreshold, setGasThreshold] = useState(1000)

  const ref = useRef<HTMLDivElement>(null)
  const externalCallsListRef = useRef<ViewportListRef>(null)
  const expensiveOpsListRef = useRef<ViewportListRef>(null)

  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const activeStrucLog = useSelector(structlogsSelectors.selectActiveStructLog)

  const externalCalls = structLogs.filter((structLog) => checkIfOfCreateOrCallType(structLog as unknown as TReturnedTraceLog))

  const expensiveOps = gasThreshold ? structLogs.filter(({ gasCost }) => gasCost >= gasThreshold) : []

  return (
    <StyledCollapse in={isOpen}>
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
              const { gasCost, op, pc, index } = item

              return (
                <ExplorerListRow
                  key={index}
                  chipValue={`gas: ${gasCost}`}
                  opCode={op}
                  pc={pc}
                  isActive={index === activeStrucLog?.index}
                  onClick={() => selectStructLog(item)}
                />
              )
            }}
          </ViewportList>
        ) : (
          <StyledInfo>None were found</StyledInfo>
        )}

        <StyledHeadingWrapper>
          <StyledQuickLinksHeading>From gas cost</StyledQuickLinksHeading>
          <StyledInput
            variant="standard"
            value={gasThreshold || ''}
            onChange={(event) => setGasThreshold(Number(event.target.value))}
          />
        </StyledHeadingWrapper>

        {expensiveOps.length > 0 ? (
          <ViewportList
            ref={expensiveOpsListRef}
            viewportRef={ref}
            items={expensiveOps}
          >
            {(item) => {
              const { gasCost, op, pc, index } = item

              return (
                <ExplorerListRow
                  key={index}
                  chipValue={`gas: ${gasCost}`}
                  opCode={op}
                  pc={pc}
                  isActive={index === activeStrucLog?.index}
                  onClick={() => selectStructLog(item)}
                />
              )
            }}
          </ViewportList>
        ) : (
          <StyledInfo>None were found</StyledInfo>
        )}
      </StyledListWrapper>
    </StyledCollapse>
  )
}
