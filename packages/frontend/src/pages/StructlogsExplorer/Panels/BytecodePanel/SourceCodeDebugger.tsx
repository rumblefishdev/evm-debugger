import { usePreviousProps } from '@mui/utils'
import { useEffect, useMemo, useState } from 'react'

import { useSources } from '../../../../components/SourceCodeDisplayer'
import {
  StyledLoading,
  StyledSyntaxHighlighter,
} from '../../../../components/SourceCodeDisplayer/styles'
import { StyledListWrapper } from '../styles'

import {
  NoSourceCodeHero,
  StyledSourceSection,
  StyledSourceSectionHeading,
} from './styles'

export type SourceCodeDebuggerProps = {
  source?: string
}

export const SourceCodeDebugger = ({ source }: SourceCodeDebuggerProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const sources = useSources(source)
  const sourceItems = useMemo(
    () =>
      Object.entries(sources).map(([name, sourceCode]) => ({
        sourceCode,
        name,
      })),
    [sources],
  )

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
      <StyledListWrapper>
        {sourceItems.map(({ sourceCode, name }) => (
          <>
            <StyledSourceSectionHeading variant="headingUnknown">
              {name}
            </StyledSourceSectionHeading>

            <StyledSourceSection>
              <StyledSyntaxHighlighter source={sourceCode} />
            </StyledSourceSection>
          </>
        ))}
      </StyledListWrapper>
    )
  ) : (
    <NoSourceCodeHero variant="headingUnknown">
      No source code available for this contract
    </NoSourceCodeHero>
  )
}
