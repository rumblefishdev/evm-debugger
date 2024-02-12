import React from 'react'
import { checkIfOfCreateOrCallType } from '@evm-debuger/analyzer/dist/helpers/helpers'
import { useSelector } from 'react-redux'

import { structlogsSelectors } from '../../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'
import { useTypedDispatch } from '../../../../../store/storeHooks'
import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'
import { activeStructLogActions } from '../../../../../store/activeStructLog/activeStructLog.slice'

import { QuickLinksComponent } from './QuickLinks.component'

export const QuickLinksContainer: React.FC = () => {
  const dispatch = useTypedDispatch()
  const [gasThreshold, setGasThreshold] = React.useState(1000)

  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const activeStrucLog = useSelector(activeStructLogSelectors.selectActiveStructLog)

  const setActiveStructlog = React.useCallback(
    (structLog: TStructlogWithListIndex) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structLog))
    },
    [dispatch],
  )

  const handleSetGasThreshold = React.useCallback((newGasThreshold: number) => {
    setGasThreshold(newGasThreshold)
  }, [])

  const externalCalls = React.useMemo(() => {
    return Object.entries(structLogs)
      .map(([_, structLog]) => structLog)
      .filter((structLog) => checkIfOfCreateOrCallType(structLog))
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
