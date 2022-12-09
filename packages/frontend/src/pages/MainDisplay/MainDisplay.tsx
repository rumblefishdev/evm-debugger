import React from 'react'

import { BlockSummary } from '../../components/BlockSummary'
import { ContentMap } from '../../components/ContentMap'
import { useAnalyzer } from '../../hooks/useAnalyzer'

import type { MainDisplayProps } from './MainDisplay.types'
import { StyledContentWrapper, StyledMainDisplay } from './styles'

export const MainDisplay = ({ ...props }: MainDisplayProps) => {
  const { isLoading } = useAnalyzer()

  console.log(isLoading)

  return (
    <StyledMainDisplay {...props}>
      {isLoading ? null : (
        <StyledContentWrapper>
          <ContentMap />
          <BlockSummary />
        </StyledContentWrapper>
      )}
    </StyledMainDisplay>
  )
}
