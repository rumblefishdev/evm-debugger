import { useSelector } from 'react-redux'
import { usePreviousProps } from '@mui/utils'
import React from 'react'

import { useTypedSelector } from '../../../../../store/storeHooks'
import { contractNamesSelectors } from '../../../../../store/contractNames/contractNames.selectors'
import { activeSourceFileSelectors } from '../../../../../store/activeSourceFile/activeSourceFile.selectors'
import { activeBlockSelectors } from '../../../../../store/activeBlock/activeBlock.selector'
import { useSources } from '../../../../../components/SourceCodeDisplayer'
import { StyledLoading } from '../../../../../components/SourceCodeDisplayer/styles'
import { sourceCodesSelectors } from '../../../../../store/sourceCodes/sourceCodes.selectors'

import type { ISourceCodeDebuggerContainerProps } from './SourceCodeDebugger.types'
import { NoSourceCodeHero, StyledSourceWrapper } from './SourceCodeDebugger.styles'
import { TreeFileViewContainer } from './TreeFileView/TreeFileView.container'
import { SourceCodeViewContainer } from './SourceCodeView/SourceCodeView.container'

export const SourceCodeDebuggerContainer: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [sourceFiles, setSourceFiles] = React.useState<{ sourceCode: string; name: string }[]>([])
  const [activeSourceCode, setActiveSourceCode] = React.useState<string>()

  const activeSourceFileId = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)
  const source = useTypedSelector((state) => sourceCodesSelectors.selectByAddress(state, activeBlock.address))?.sourceCode

  const { contractName } = useTypedSelector((state) => contractNamesSelectors.selectByAddress(state, activeBlock.address))

  const sourceNameToCodeMap = useSources(contractName, source)

  const didSourceChange = usePreviousProps<ISourceCodeDebuggerContainerProps>({ source }).source !== source

  const isSourcePresent = source && sourceFiles && sourceFiles[activeSourceFileId]
  const shouldDisplayLoading = isLoading || didSourceChange

  React.useEffect(() => {
    setSourceFiles(Object.entries(sourceNameToCodeMap).map(([name, sourceCode]) => ({ sourceCode, name })))
  }, [sourceNameToCodeMap])

  React.useEffect(() => {
    setActiveSourceCode(sourceFiles?.[activeSourceFileId]?.sourceCode || null)
  }, [sourceFiles, activeSourceFileId])

  React.useEffect(() => {
    if (didSourceChange && !isLoading) setIsLoading(true)
    else {
      const timeout = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, didSourceChange])

  switch (true) {
    case isSourcePresent && !shouldDisplayLoading:
      return (
        <StyledSourceWrapper>
          <TreeFileViewContainer sourceFiles={sourceFiles} />
          <SourceCodeViewContainer activeSourceCode={activeSourceCode} />
        </StyledSourceWrapper>
      )
    case isSourcePresent && shouldDisplayLoading:
      return <StyledLoading />
    default:
      return <NoSourceCodeHero variant="headingUnknown">No source code available for this contract</NoSourceCodeHero>
  }
}
