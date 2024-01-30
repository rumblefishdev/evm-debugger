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

import { SourceCodeView } from './SourceCodeView.component'

export const SourceCodeViewContainer: React.FC = () => {
  const dispatch = useDispatch()

  const activeStrucLog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

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
      dispatch(activeLineActions.setActiveLine({ line: event.$pos.row, fileId }))
    },
    [dispatch, fileId],
  )

  const isOnSameFile = fileId >= 0 && activeSourceFileId >= 0 && fileId === activeSourceFileId

  return (
    <SourceCodeView
      endCodeLine={isOnSameFile ? endCodeLine : -1}
      startCodeLine={isOnSameFile ? startCodeLine : -1}
      contractName={sourceFiles[activeSourceFileId]?.name}
      activeSourceCode={sourceFiles[activeSourceFileId]?.sourceCode}
      onClick={handleLineSelection}
    />
  )
}
