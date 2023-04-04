import { usePreviousProps } from '@mui/utils'
import { useEffect, useState } from 'react'

import {
  StyledDataIndex,
  StyledDataIndexesWrapper,
  StyledDataWrapper,
} from '../../../../components/RawDataDisplayer/styles'
import {
  StyledLoading,
  StyledSyntaxHighlighter,
} from '../../../../components/SourceCodeDisplayer/styles'

import { NoSourceCodeHero } from './styles'

export type SourceCodeDebuggerProps = {
  source?: string
}

export const SourceCodeDebugger = ({ source }: SourceCodeDebuggerProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const { source: prevSource } = usePreviousProps({ source }) as {
    source?: string
  }
  const didSourceChange = prevSource !== source

  useEffect(() => {
    if (didSourceChange && !isLoading) setIsLoading(true)
    else {
      const timeout = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [isLoading, didSourceChange])

  return source ? (
    isLoading || didSourceChange ? (
      <StyledLoading />
    ) : (
      <StyledDataWrapper>
        <StyledDataIndexesWrapper>
          {source.split('\n').map((_, index) => (
            <StyledDataIndex key={index}>{index}</StyledDataIndex>
          ))}
        </StyledDataIndexesWrapper>
        <StyledSyntaxHighlighter source={source} />
      </StyledDataWrapper>
    )
  ) : (
    <NoSourceCodeHero variant="headingUnknown">
      No source code available for this contract
    </NoSourceCodeHero>
  )
}
