import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import type { TAnalyzerContractBaseOutput, TTraceLog } from '@evm-debuger/types'
import { BaseOpcodesHex } from '@evm-debuger/types'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { traceLogsSelectors } from '../../store/traceLogs/traceLogs.selectors'
import { structlogsSelectors } from '../../store/structlogs/structlogs.selectors'
import { yulNodesSelectors } from '../../store/yulNodes/yulNodes.selectors'
import type { TMainTraceLogsWithId } from '../../store/traceLogs/traceLogs.types'
import { activeBlockActions } from '../../store/activeBlock/activeBlock.slice'
import { activeSourceFileActions } from '../../store/activeSourceFile/activeSourceFile.slice'
import { activeLineActions } from '../../store/activeLine/activeLine.slice'
import { activeStructLogActions } from '../../store/activeStructLog/activeStructLog.slice'
import type { TStructlogWithListIndex } from '../../store/structlogs/structlogs.types'
import { getSignature } from '../../helpers/helpers'
import { contractBaseSelectors } from '../../store/contractBase/contractBase.selectors'

import { TraceLogsListComponent } from './TraceLogsList.component'
import type { TTraceLogWithSignature } from './TraceLogsList.types'

const constructSignature = (traceLog: TTraceLog, contractNames: TAnalyzerContractBaseOutput[]): string => {
  let signature = ''
  if (BaseOpcodesHex[traceLog.op] === BaseOpcodesHex.CALL && traceLog.input === '0x' && traceLog.isContract !== null)
    signature = `Send ${traceLog.value} ETH to ${traceLog.isContract ? 'SC' : 'EOA'}`
  else {
    const contractName = contractNames.find((item) => item.address === traceLog.address)?.contractName || traceLog.address
    signature = traceLog.input.slice(0, 10)
    if (traceLog.callTypeData?.functionFragment && traceLog.isContract) {
      signature = `${contractName}.${getSignature(traceLog.callTypeData?.functionFragment)}`
    }
  }
  return signature
}

export const TraceLogsListContainer: React.FC = () => {
  const dispatch = useDispatch()
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const traceLogs = useSelector(traceLogsSelectors.selectAll)
  const contractNames = useSelector(contractBaseSelectors.selectAll)
  const structlogs = useSelector(structlogsSelectors.selectAllParsedStructLogs)
  const structlogsOfInnerFunctions = useSelector(yulNodesSelectors.selectJumpDestStructLogs)

  const activateTraceLog = React.useCallback(
    (traceLog: TMainTraceLogsWithId) => {
      dispatch(activeBlockActions.loadActiveBlock(traceLog))
      dispatch(activeSourceFileActions.setActiveSourceFile(0))
      dispatch(activeLineActions.clearActiveLine())
      dispatch(activeStructLogActions.setActiveStrucLog({ ...structlogs[traceLog.startIndex], listIndex: 0 }))
    },
    [dispatch, structlogs],
  )

  const activateStructlog = React.useCallback(
    (structLog: TStructlogWithListIndex) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structLog))
    },
    [dispatch],
  )

  const traceLogsWithSignature: TTraceLogWithSignature[] = React.useMemo(() => {
    return traceLogs.map((traceLog) => ({ ...traceLog, signature: constructSignature(traceLog, contractNames) }))
  }, [traceLogs, contractNames])

  return (
    <TraceLogsListComponent
      activeTraceLogIndex={activeBlock?.index || 0}
      currentInnerFunctions={structlogsOfInnerFunctions}
      traceLogs={traceLogsWithSignature}
      activateStructLog={activateStructlog}
      activateTraceLog={activateTraceLog}
    />
  )
}
