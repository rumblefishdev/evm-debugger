import React from 'react'
import { useSelector } from 'react-redux'

import { useTypedSelector } from '../../../../../store/storeHooks'
import { instructionsSelectors } from '../../../../../store/instructions/instructions.selectors'
import { activeBlockSelectors } from '../../../../../store/activeBlock/activeBlock.selector'
import { activeSourceFileSelectors } from '../../../../../store/activeSourceFile/activeSourceFile.selectors'
import { sourceCodesSelectors } from '../../../../../store/sourceCodes/sourceCodes.selectors'
import { activeStructLogSelectors } from '../../../../../store/activeStructLog/activeStructLog.selectors'

import { SourceCodeView } from './SourceCodeView.component'

export const SourceCodeViewContainer: React.FC = () => {
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

  const isOnSameFile = fileId >= 0 && activeSourceFileId >= 0 && fileId === activeSourceFileId

  console.log('currentInstruction', instructions[activeStrucLog?.pc])

  return (
    <SourceCodeView
      endCodeLine={isOnSameFile ? endCodeLine : -1}
      startCodeLine={isOnSameFile ? startCodeLine : -1}
      contractName={sourceFiles[activeSourceFileId]?.name}
      activeSourceCode={sourceFiles[activeSourceFileId]?.sourceCode}
    />
  )
}
