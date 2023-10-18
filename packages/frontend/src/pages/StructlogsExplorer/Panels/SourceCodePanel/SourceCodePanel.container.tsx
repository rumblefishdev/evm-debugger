import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { usePreviousProps } from '@mui/utils'

import { StyledLoading } from '../../../../components/SourceCodeDisplayer/styles'
import { activeBlockSelectors } from '../../../../store/activeBlock/activeBlock.selector'

import type { ISourceCodePanelContainerProps } from './SourceCodePanel.types'
import { NoSourceCodeHero } from './SourceCodePanel.styles'
import { SourceCodePanelComponent } from './SourceCodePanel.component'

export const SourceCodePanelContainer: React.FC<ISourceCodePanelContainerProps> = ({ close, isSourceCodeAvailable }) => {
  const [isLoading, setIsLoading] = useState(false)

  const activeBlock = useSelector(activeBlockSelectors.selectActiveBlock)

  const didSourceChanged = usePreviousProps(activeBlock.address) !== activeBlock.address

  useEffect(() => {
    if (!isLoading && didSourceChanged) setIsLoading(true)
    else {
      const timeout = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, didSourceChanged])

  const shouldDisplayLoading = isLoading && didSourceChanged

  if (!isSourceCodeAvailable)
    return <NoSourceCodeHero variant="headingUnknown">No source code available for this contract</NoSourceCodeHero>

  return shouldDisplayLoading ? <StyledLoading /> : <SourceCodePanelComponent close={close} />
}
