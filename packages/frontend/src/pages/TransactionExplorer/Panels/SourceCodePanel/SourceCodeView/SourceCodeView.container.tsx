import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTypedSelector } from '../../../../../store/storeHooks'
import { instructionsSelectors } from '../../../../../store/instructions/instructions.selectors'
import { activeBlockSelectors } from '../../../../../store/activeBlock/activeBlock.selector'
import { activeSourceFileSelectors } from '../../../../../store/activeSourceFile/activeSourceFile.selectors'
import { sourceCodesSelectors } from '../../../../../store/sourceCodes/sourceCodes.selectors'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'
import type { AceEditorClickEvent } from '../../../../../components/AceEditor/AceEditor.types'
import { activeLineActions } from '../../../../../store/activeLine/activeLine.slice'
import { activeLineSelectors } from '../../../../../store/activeLine/activeLine.selectors'
import { activeStructLogActions } from '../../../../../store/activeStructLog/activeStructLog.slice'
import { structlogsSelectors } from '../../../../../store/structlogs/structlogs.selectors'

import { SourceCodeView } from './SourceCodeView.component'

export const SourceCodeViewContainer: React.FC = () => {
  const dispatch = useDispatch()

  const activeStrucLog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const structlogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  console.log('structlogs', structlogs)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const currentSelectedLineNumber = useSelector(activeLineSelectors.selectActiveLine)
  const lineRowsAvailableForSelections = useSelector(activeLineSelectors.selectAvailableLinesForCurrentFile)

  const test = useSelector(activeLineSelectors.selectStructlogsPerLineForActiveBlock)
  console.log('test', test)
  const activeSourceFileId = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const sourceFiles = useSelector(sourceCodesSelectors.selectCurrentSourceFiles)

  const { instructions } = useTypedSelector((state) => instructionsSelectors.selectByAddress(state, activeBlock.address))

  const { endCodeLine, startCodeLine, fileId } = instructions[activeStrucLog?.pc] || {
    startCodeLine: null,
    fileId: null,
    endCodeLine: null,
  }

  const handleLineSelection = React.useCallback(
    (event: AceEditorClickEvent) => {
      const aaaa = structlogs[Array.from(test[fileId][event.$pos.row])[0].index]

      console.log('fileId', fileId)
      console.log('event.$pos.row', event.$pos.row)
      console.log('test[fileId]', test[fileId])
      console.log('Array.from(test[fileId][event.$pos.row])', Array.from(test[fileId][event.$pos.row]))
      console.log('aaaa', aaaa)

      dispatch(activeStructLogActions.setActiveStrucLog(aaaa))
      dispatch(activeLineActions.setActiveLine({ line: event.$pos.row }))
    },
    [dispatch, fileId, structlogs, test],
  )

  const isOnSameFile = fileId >= 0 && activeSourceFileId >= 0 && fileId === activeSourceFileId

  return (
    <SourceCodeView
      endCodeLine={isOnSameFile ? endCodeLine : -1}
      startCodeLine={isOnSameFile ? startCodeLine : -1}
      contractName={sourceFiles[activeSourceFileId]?.name}
      activeSourceCode={sourceFiles[activeSourceFileId]?.sourceCode}
      currentSelectedLine={currentSelectedLineNumber}
      onClick={handleLineSelection}
      lineRowsAvailableForSelections={lineRowsAvailableForSelections}
    />
  )
}
