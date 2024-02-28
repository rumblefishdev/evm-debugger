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

  const structlogs = useSelector(structlogsSelectors.selectParsedStructLogs)

  const currentSelectedLineNumber = useSelector(activeLineSelectors.selectActiveLine)
  const lineRowsAvailableForSelections = useSelector(activeLineSelectors.selectAvailableLinesForCurrentFile)

  const structlogsPerLine = useSelector(activeLineSelectors.selectStructlogsPerLineForActiveBlock)
  const activeSourceFileId = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const sourceFiles = useSelector(sourceCodesSelectors.selectCurrentSourceFiles)

  // const currentInstructions = useSelector(instructionsSelectors.selectCurrentInstructions)
  // console.log('currentInstructions', currentInstructions)
  const currentInstruction = useSelector(instructionsSelectors.selectCurrentSourceCodeInstruction)

  const { fileId, endCodeLine, startCodeLine, endColumn, startColumn } = currentInstruction || {
    startCodeLine: null,
    fileId: null,
    endCodeLine: null,
  }

  console.log('currentInstruction', {
    startColumn,
    startCodeLine,
    fileId,
    endColumn,
    endCodeLine,
  })

  // const { instructions } = useTypedSelector((state) => instructionsSelectors.selectByAddress(state, activeBlock.address))

  // const { endCodeLine, startCodeLine, fileId } = instructions[activeStrucLog?.pc] || {
  //   startCodeLine: null,
  //   fileId: null,
  //   endCodeLine: null,
  // }

  const handleLineSelection = React.useCallback(
    (event: AceEditorClickEvent) => {
      dispatch(activeLineActions.setActiveLine({ line: event.$pos.row }))
      if (!structlogsPerLine[fileId][event.$pos.row] || structlogsPerLine[fileId][event.$pos.row].length === 0) return
      const firstStructlogForLine = structlogs[structlogsPerLine[fileId][event.$pos.row][0].index]
      dispatch(activeStructLogActions.setActiveStrucLog(firstStructlogForLine))
    },
    [dispatch, fileId, structlogs, structlogsPerLine],
  )

  console.log('fileId', fileId)
  console.log('activeSourceFileId', activeSourceFileId)

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
      startCodeColumn={startColumn}
      endCodeColumn={endColumn}
    />
  )
}
