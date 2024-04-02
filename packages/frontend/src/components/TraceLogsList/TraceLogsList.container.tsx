import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { structlogsSelectors } from '../../store/structlogs/structlogs.selectors'
import { activeBlockActions } from '../../store/activeBlock/activeBlock.slice'
import { activeLineActions } from '../../store/activeLine/activeLine.slice'
import { activeStructLogActions } from '../../store/activeStructLog/activeStructLog.slice'
import { sourceFilesActions } from '../../store/sourceFiles/sourceFiles.slice'
import { functionStackSelectors } from '../../store/functionStacks/functionStack.selectors'
import { activeStructLogSelectors } from '../../store/activeStructLog/activeStructLog.selectors'
import { traceLogsSelectors } from '../../store/traceLogs/traceLogs.selectors'

import { TraceLogsListComponent } from './TraceLogsList.component'

export const TraceLogsListContainer: React.FC = () => {
  const dispatch = useDispatch()
  const activeTraceLogIndex = useSelector(activeBlockSelectors.selectActiveBlock).index || 0
  const activeStructlogIndex = useSelector(activeStructLogSelectors.selectIndex)
  const structlogs = useSelector(structlogsSelectors.selectAllParsedStructLogs)
  const traceLogs = useSelector(traceLogsSelectors.selectEntities)
  const functionsStack = useSelector(functionStackSelectors.selectAll)

  const activateTraceLog = React.useCallback(
    (traceLogIndex: number) => {
      dispatch(activeBlockActions.loadActiveBlock(traceLogs[traceLogIndex]))
      dispatch(sourceFilesActions.setActiveSourceFileId(0))
      dispatch(activeLineActions.clearActiveLine())
      // dispatch(activeStructLogActions.setActiveStrucLog({ ...structlogs[traceLogs[traceLogIndex].startIndex], listIndex: 0 }))
    },
    [dispatch, traceLogs],
  )

  const activateStructlog = React.useCallback((structLogIndex: number) => {
    // dispatch(activeStructLogActions.setActiveStrucLog(structlogs[structLogIndex]))
  }, [])

  return (
    <TraceLogsListComponent
      activeStructLogIndex={activeStructlogIndex}
      activeTraceLogIndex={activeTraceLogIndex}
      functionStack={functionsStack}
      activateStructLog={activateStructlog}
      activateTraceLog={activateTraceLog}
    />
  )
}
