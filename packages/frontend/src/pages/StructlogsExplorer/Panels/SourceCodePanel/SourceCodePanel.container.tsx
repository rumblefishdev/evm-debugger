import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { usePreviousProps } from '@mui/utils'

import { activeSourceFileSelectors } from '../../../../store/activeSourceFile/activeSourceFile.selectors'
import { activeBlockSelectors } from '../../../../store/activeBlock/activeBlock.selector'
import { useTypedSelector } from '../../../../store/storeHooks'
import { useSources } from '../../../../components/SourceCodeDisplayer'
import { contractNamesSelectors } from '../../../../store/contractNames/contractNames.selectors'
import { StyledLoading } from '../../../../components/SourceCodeDisplayer/styles'

import type { ISourceCodePanelContainerProps } from './SourceCodePanel.types'
import { NoSourceCodeHero } from './SourceCodePanel.styles'
import { SourceCodePanelComponent } from './SourceCodePanel.component'

export const SourceCodePanelContainer: React.FC<ISourceCodePanelContainerProps> = ({ close, source }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [sourceFiles, setSourceFiles] = useState<{ sourceCode: string; name: string }[]>([])
  const [activeSourceCode, setActiveSourceCode] = useState<string>()

  const activeSourceFileId = useSelector(activeSourceFileSelectors.selectActiveSourceFile)
  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const { contractName } = useTypedSelector((state) => contractNamesSelectors.selectByAddress(state, activeBlock.address))

  const sourceNameToCodeMap = useSources(contractName, source)

  const didSourceChanged = usePreviousProps<ISourceCodePanelContainerProps>({ source, close })?.source !== source

  useEffect(() => {
    setSourceFiles(Object.entries(sourceNameToCodeMap).map(([name, sourceCode]) => ({ sourceCode, name })))
  }, [sourceNameToCodeMap])

  useEffect(() => {
    setActiveSourceCode(sourceFiles?.[activeSourceFileId]?.sourceCode || null)
  }, [sourceFiles, activeSourceFileId])

  useEffect(() => {
    if (!isLoading && didSourceChanged) setIsLoading(true)
    else {
      const timeout = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, didSourceChanged])

  const isSourcePresent = source && sourceFiles && sourceFiles[activeSourceFileId]
  const shouldDisplayLoading = isLoading && didSourceChanged

  switch (true) {
    case isSourcePresent && !shouldDisplayLoading:
      return (
        <SourceCodePanelComponent
          activeSourceCode={activeSourceCode}
          sourceFiles={sourceFiles}
          close={close}
        />
      )
    case isSourcePresent && shouldDisplayLoading:
      return <StyledLoading />
    default:
      return <NoSourceCodeHero variant="headingUnknown">No source code available for this contract</NoSourceCodeHero>
  }
}
