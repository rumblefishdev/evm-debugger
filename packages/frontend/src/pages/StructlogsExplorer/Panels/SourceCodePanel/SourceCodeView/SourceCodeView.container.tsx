import React from 'react'
import { useSelector } from 'react-redux'

import { useTypedSelector } from '../../../../../store/storeHooks'
import { instructionsSelectors } from '../../../../../store/instructions/instructions.selectors'
import { structlogsSelectors } from '../../../../../store/structlogs/structlogs.selectors'
import { activeBlockSelectors } from '../../../../../store/activeBlock/activeBlock.selector'
import { contractNamesSelectors } from '../../../../../store/contractNames/contractNames.selectors'
import { activeSourceFileSelectors } from '../../../../../store/activeSourceFile/activeSourceFile.selectors'
import { sourceCodesSelectors } from '../../../../../store/sourceCodes/sourceCodes.selectors'

import { SourceCodeView } from './SourceCodeView.component'

export const SourceCodeViewContainer: React.FC = () => {
  const activeStrucLog = useSelector(structlogsSelectors.selectActiveStructLog)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const activeSourceFileId = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const sourceFiles = useSelector(sourceCodesSelectors.selectCurrentSourceFiles)

  const { instructions } = useTypedSelector((state) => instructionsSelectors.selectByAddress(state, activeBlock.address))
  const { contractName } = useTypedSelector((state) => contractNamesSelectors.selectByAddress(state, activeBlock.address))

  const { endCodeLine, startCodeLine } = instructions[activeStrucLog.pc]

  return (
    <SourceCodeView
      endCodeLine={endCodeLine}
      startCodeLine={startCodeLine}
      contractName={contractName}
      activeSourceCode={sourceFiles[activeSourceFileId]?.sourceCode}
    />
  )
}
