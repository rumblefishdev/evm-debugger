import { useCallback, useRef, useState } from 'react'
import { ViewportList } from 'react-viewport-list'
import type { ViewportListRef } from 'react-viewport-list'
import { checkIfOfCreateOrCallType } from '@evm-debuger/analyzer/dist/helpers/helpers'
import type { TReturnedTraceLog } from '@evm-debuger/types'
import { useSelector } from 'react-redux'

import type { IExtendedStructLog } from '../../../../../types'
import { StyledListWrapper } from '../../styles'
import { ExplorerListRow } from '../../../../../components/ExplorerListRow'
import { structlogsSelectors } from '../../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'
import { activeStructLogActions } from '../../../../../store/activeStructLog/activeStructLog.slice'
import { StyledTextField, StyledInfo, StyledHeadingWrapper, StyledQuickLinksHeading } from '../styles'
import { useTypedDispatch } from '../../../../../store/storeHooks'

export const QuickLinks: React.FC = () => {
  const dispatch = useTypedDispatch()
  const [gasThreshold, setGasThreshold] = useState(1000)

  const ref = useRef<HTMLDivElement>(null)
  const externalCallsListRef = useRef<ViewportListRef>(null)
  const expensiveOpsListRef = useRef<ViewportListRef>(null)

  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const activeStrucLog = useSelector(activeStructLogSelectors.selectActiveStructLog)

  const externalCalls = Object.entries(structLogs)
    .map(([_, structLog]) => structLog)
    .filter((structLog) => checkIfOfCreateOrCallType(structLog as unknown as TReturnedTraceLog))

  const expensiveOps = gasThreshold
    ? Object.entries(structLogs)
        .map(([_, structLog]) => structLog)
        .filter(({ gasCost }) => gasCost >= gasThreshold)
    : []

  console.log('externalCalls', externalCalls)
  console.log('expensiveOps', expensiveOps)

  const setActiveStructlog = useCallback(
    (structLog: IExtendedStructLog) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structLog.index))
    },
    [dispatch],
  )

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
            const { gasCost, op, pc, index } = item

            return (
              <ExplorerListRow
                key={index}
                chipValue={`gas: ${gasCost}`}
                opCode={op}
                pc={pc}
                isActive={index === activeStrucLog?.index}
                onClick={() => setActiveStructlog(item)}
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
                onClick={() => setActiveStructlog(item)}
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
