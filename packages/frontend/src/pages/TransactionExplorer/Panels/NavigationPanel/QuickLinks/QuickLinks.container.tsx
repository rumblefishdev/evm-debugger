import React from 'react'
import { useSelector } from 'react-redux'
import { checkOpcodeIfOfCallOrCreateGroupType } from '@evm-debuger/analyzer'

import { structlogsSelectors } from '../../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'
import { useTypedDispatch } from '../../../../../store/storeHooks'
import { activeStructLogActions } from '../../../../../store/activeStructLog/activeStructLog.slice'
import { activeBlockSelectors } from '../../../../../store/activeBlock/activeBlock.selector'
import { activeBlockActions } from '../../../../../store/activeBlock/activeBlock.slice'
import { traceLogsSelectors } from '../../../../../store/traceLogs/traceLogs.selectors'

import { QuickLinksComponent } from './QuickLinks.component'

export const QuickLinksContainer: React.FC = () => {
  const dispatch = useTypedDispatch()
  const [gasThreshold, setGasThreshold] = React.useState(1000)

  const structLogs = useSelector(structlogsSelectors.selectAllParsedStructLogs)
  const traceLogs = useSelector(traceLogsSelectors.selectEntities)
  const activeStructLogIndex = useSelector(activeStructLogSelectors.selectIndex)
  const activeTraceLogIndex = useSelector(activeBlockSelectors.selectActiveBlock).index || 0

  const setActiveStructlog = React.useCallback(
    (structLogIndex: number, traceLogIndex: number) => {
      if (traceLogIndex !== activeTraceLogIndex && traceLogIndex !== structLogIndex) {
        dispatch(activeBlockActions.loadActiveBlock(traceLogs[traceLogIndex]))
      }

      dispatch(activeStructLogActions.setActiveStrucLog(structLogIndex))
    },
    [dispatch, activeTraceLogIndex, traceLogs],
  )

  const handleSetGasThreshold = React.useCallback((newGasThreshold: number) => {
    setGasThreshold(newGasThreshold)
  }, [])

  const externalCalls = React.useMemo(() => {
    return Object.values(structLogs).filter(({ op }) => checkOpcodeIfOfCallOrCreateGroupType(op))
  }, [structLogs])

  const reverts = React.useMemo(() => {
    return Object.values(structLogs).filter(({ op }) => op === 'REVERT')
  }, [structLogs])

  const expensiveOps = React.useMemo(() => {
    if (!gasThreshold) return []
    return gasThreshold ? Object.values(structLogs).filter(({ gasCost }) => gasCost >= gasThreshold) : []
  }, [structLogs, gasThreshold])

  return (
    <QuickLinksComponent
      externalCalls={externalCalls}
      reverts={reverts}
      activeStructLogIndex={activeStructLogIndex}
      expensiveOps={expensiveOps}
      gasThreshold={gasThreshold}
      handleSetGasThreshold={handleSetGasThreshold}
      setActiveStructlog={setActiveStructlog}
    />
  )
}
