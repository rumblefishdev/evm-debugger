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
import { uiSelectors } from '../../store/ui/ui.selectors'
import { uiActions } from '../../store/ui/ui.slice'

import { FunctionStackTraceComponent } from './FunctionStackTrace.component'
import { convertFunctionStackToTree } from './FunctionStackTrace.utils'

export const FunctionStackTrace: React.FC = () => {
  const dispatch = useDispatch()
  const activeTraceLogIndex = useSelector(activeBlockSelectors.selectActiveBlock).index || 0
  const activeStructlogIndex = useSelector(activeStructLogSelectors.selectIndex)
  const structlogs = useSelector(structlogsSelectors.selectAllParsedStructLogs)
  const traceLogs = useSelector(traceLogsSelectors.selectEntities)
  const functionsStack = useSelector(functionStackSelectors.selectAll)
  const isMainFunctionsVisible = useSelector(uiSelectors.selectDisplayMainFunctions)
  const isYulFunctionsVisible = useSelector(uiSelectors.selectDisplayYulFunctions)

  const activateTraceLog = React.useCallback(
    (traceLogIndex: number) => {
      dispatch(activeBlockActions.loadActiveBlock(traceLogs[traceLogIndex]))
      dispatch(sourceFilesActions.setActiveSourceFileId(0))
      dispatch(activeLineActions.clearActiveLine())
      dispatch(activeStructLogActions.setActiveStrucLog({ ...structlogs[traceLogs[traceLogIndex].startIndex], listIndex: 0 }))
    },
    [dispatch, structlogs, traceLogs],
  )

  const activateStructlog = React.useCallback(
    (structLogIndex: number) => {
      dispatch(activeStructLogActions.setActiveStrucLog(structlogs[structLogIndex]))
    },
    [dispatch, structlogs],
  )

  const toggleMainFunctions = React.useCallback(() => {
    dispatch(uiActions.setDisplayMainFunctions(!isMainFunctionsVisible))
  }, [dispatch, isMainFunctionsVisible])
  const toggleYulFunctions = React.useCallback(() => {
    dispatch(uiActions.setDisplayYulFunctions(!isYulFunctionsVisible))
  }, [dispatch, isYulFunctionsVisible])

  const functionStackAsTree = React.useMemo(() => {
    return convertFunctionStackToTree(functionsStack, 0)
  }, [functionsStack])

  console.log('functionStackAsTree', functionStackAsTree)

  return (
    <FunctionStackTraceComponent
      activeStructLogIndex={activeStructlogIndex}
      activeTraceLogIndex={activeTraceLogIndex}
      functionStack={functionStackAsTree}
      activateStructLog={activateStructlog}
      activateTraceLog={activateTraceLog}
      toggleMainFunctions={toggleMainFunctions}
      toggleYulFunctions={toggleYulFunctions}
      isMainFunctionsVisible={isMainFunctionsVisible}
      isYulFunctionsVisible={isYulFunctionsVisible}
    />
  )
}
