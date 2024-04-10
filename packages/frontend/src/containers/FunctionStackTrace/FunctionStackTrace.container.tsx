import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { activeBlockSelectors } from '../../store/activeBlock/activeBlock.selector'
import { activeBlockActions } from '../../store/activeBlock/activeBlock.slice'
import { activeStructLogActions } from '../../store/activeStructLog/activeStructLog.slice'
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

  const traceLogs = useSelector(traceLogsSelectors.selectEntities)
  const functionsStack = useSelector(functionStackSelectors.selectAll)
  const isSolcMiddlewaresVisible = useSelector(uiSelectors.selectDisplaySolcMiddlewares)
  const isYulFunctionsVisible = useSelector(uiSelectors.selectDisplayYulFunctions)

  const activateFunction = React.useCallback(
    (traceLogIndex: number, structLogIndex: number) => {
      dispatch(uiActions.setShouldShowFunctionStackTrace(false))

      if (traceLogIndex !== structLogIndex) {
        dispatch(activeBlockActions.loadActiveBlock(traceLogs[traceLogIndex]))
      }

      dispatch(activeStructLogActions.setActiveStrucLog(structLogIndex))
    },
    [dispatch, traceLogs],
  )

  const toggleSolcMiddlewares = React.useCallback(() => {
    dispatch(uiActions.setDisplaySolcMiddlewares(!isSolcMiddlewaresVisible))
  }, [dispatch, isSolcMiddlewaresVisible])
  const toggleYulFunctions = React.useCallback(() => {
    dispatch(uiActions.setDisplayYulFunctions(!isYulFunctionsVisible))
  }, [dispatch, isYulFunctionsVisible])

  const functionStackAsTree = React.useMemo(() => {
    return convertFunctionStackToTree(functionsStack, 0)
  }, [functionsStack])

  return (
    <FunctionStackTraceComponent
      activeStructLogIndex={activeStructlogIndex}
      activeTraceLogIndex={activeTraceLogIndex}
      functionStack={functionStackAsTree}
      activateFunction={activateFunction}
      toggleSolcMiddlewares={toggleSolcMiddlewares}
      toggleYulFunctions={toggleYulFunctions}
      isSolcMiddlewaresVisible={isSolcMiddlewaresVisible}
      isYulFunctionsVisible={isYulFunctionsVisible}
    />
  )
}
