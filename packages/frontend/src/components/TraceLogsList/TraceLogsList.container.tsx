import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import type { TAnalyzerContractBaseOutput, TTraceLog } from '@evm-debuger/types'
import { BaseOpcodesHex } from '@evm-debuger/types'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { traceLogsSelectors } from '../../store/traceLogs/traceLogs.selectors'
import { structlogsSelectors } from '../../store/structlogs/structlogs.selectors'
import type { TMainTraceLogsWithId } from '../../store/traceLogs/traceLogs.types'
import { activeBlockActions } from '../../store/activeBlock/activeBlock.slice'
import { activeLineActions } from '../../store/activeLine/activeLine.slice'
import { activeStructLogActions } from '../../store/activeStructLog/activeStructLog.slice'
import { getSignature } from '../../helpers/helpers'
import { contractBaseSelectors } from '../../store/contractBase/contractBase.selectors'
import { sourceFilesActions } from '../../store/sourceFiles/sourceFiles.slice'
import { functionStackSelectors } from '../../store/functionStacks/functionStack.selectors'

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
  const functionsStack = useSelector(functionStackSelectors.selectEntities)

  const activateTraceLog = React.useCallback(
    (traceLog: TMainTraceLogsWithId) => {
      dispatch(activeBlockActions.loadActiveBlock(traceLog))
      dispatch(sourceFilesActions.setActiveSourceFileId(0))
      dispatch(activeLineActions.clearActiveLine())
      dispatch(activeStructLogActions.setActiveStrucLog({ ...structlogs[traceLog.startIndex], listIndex: 0 }))
    },
    [dispatch, structlogs],
  )

  const activateStructlog = React.useCallback(
    (structLogIndex: number) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structlogs[structLogIndex]))
    },
    [dispatch, structlogs],
  )

  const traceLogsWithSignature: TTraceLogWithSignature[] = React.useMemo(() => {
    return traceLogs.map((traceLog) => ({ ...traceLog, signature: constructSignature(traceLog, contractNames) }))
  }, [traceLogs, contractNames])

  return (
    <TraceLogsListComponent
      activeTraceLogIndex={activeBlock?.index || 0}
      currentInnerFunctions={functionsStack[activeBlock?.index].functions}
      traceLogs={traceLogsWithSignature}
      activateStructLog={activateStructlog}
      activateTraceLog={activateTraceLog}
    />
  )
}
