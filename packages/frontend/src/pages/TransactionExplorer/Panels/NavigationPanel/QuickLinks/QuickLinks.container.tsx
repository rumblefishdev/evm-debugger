import React from 'react'
import { useSelector } from 'react-redux'
import { checkOpcodeIfOfCallOrCreateGroupType } from '@evm-debuger/analyzer'

import { structlogsSelectors } from '../../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'
import { useTypedDispatch } from '../../../../../store/storeHooks'
import { activeStructLogActions } from '../../../../../store/activeStructLog/activeStructLog.slice'

import { QuickLinksComponent } from './QuickLinks.component'

export const QuickLinksContainer: React.FC = () => {
  const dispatch = useTypedDispatch()
  const [gasThreshold, setGasThreshold] = React.useState(1000)

  const structLogs = useSelector(structlogsSelectors.selectAllParsedStructLogs)
  const activeStrucLog = useSelector(activeStructLogSelectors.selectActiveStructLog)

  const setActiveStructlog = React.useCallback(
    (structLog: number) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structLog))
    },
    [dispatch],
  )

  const handleSetGasThreshold = React.useCallback((newGasThreshold: number) => {
    setGasThreshold(newGasThreshold)
  }, [])

  const externalCalls = React.useMemo(() => {
    return Object.values(structLogs).filter(({ op }) => checkOpcodeIfOfCallOrCreateGroupType(op))
  }, [structLogs])

  const expensiveOps = React.useMemo(() => {
    if (!gasThreshold) return []
    return gasThreshold ? Object.values(structLogs).filter(({ gasCost }) => gasCost >= gasThreshold) : []
  }, [structLogs, gasThreshold])

  return (
    <QuickLinksComponent
      externalCalls={externalCalls}
      activeStructlog={activeStrucLog}
      expensiveOps={expensiveOps}
      gasThreshold={gasThreshold}
      handleSetGasThreshold={handleSetGasThreshold}
      setActiveStructlog={setActiveStructlog}
    />
  )
}
