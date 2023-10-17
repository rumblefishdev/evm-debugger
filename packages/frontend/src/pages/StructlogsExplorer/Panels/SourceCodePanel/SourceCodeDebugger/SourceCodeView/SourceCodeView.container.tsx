import React from 'react'
import { useSelector } from 'react-redux'

import { useTypedSelector } from '../../../../../../store/storeHooks'
import { instructionsSelectors } from '../../../../../../store/instructions/instructions.selectors'
import { structlogsSelectors } from '../../../../../../store/structlogs/structlogs.selectors'
import { activeBlockSelectors } from '../../../../../../store/activeBlock/activeBlock.selector'
import { contractNamesSelectors } from '../../../../../../store/contractNames/contractNames.selectors'

import { SourceCodeView } from './SourceCodeView.component'
import type { ISourceCodeViewContainerProps } from './SourceCodeView.types'

export const SourceCodeViewContainer: React.FC<ISourceCodeViewContainerProps> = ({ activeSourceCode }) => {
  const activeStrucLog = useSelector(structlogsSelectors.selectActiveStructLog)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const { instructions } = useTypedSelector((state) => instructionsSelectors.selectByAddress(state, activeBlock.address))
  const { contractName } = useTypedSelector((state) => contractNamesSelectors.selectByAddress(state, activeBlock.address))

  const { endCodeLine, startCodeLine } = instructions[activeStrucLog.pc]

  return (
    <SourceCodeView
      endCodeLine={endCodeLine}
      startCodeLine={startCodeLine}
      contractName={contractName}
      activeSourceCode={activeSourceCode}
    />
  )
}
