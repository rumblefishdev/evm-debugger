import React from 'react'

import { Button } from '../../../../../components/Button'

import type { TSourceLineComponentProps } from './SourceLine.types'
import { StyledCode, StyledHeading, StyledHeadingWrapper, StyledNavigationButtonsWrapper, StyledWrapper } from './SourceLine.styles'

export const SourceLineComponent: React.FC<TSourceLineComponentProps> = ({
  activeLineContent,
  clearSelectedLine,
  isNextLineAvailable,
  isPreviousLineAvailable,
  moveToNextAvailableLine,
  moveToPreviousAvailableLine,
  areStructLogsAvailableForCurrentLine,
  isNextStructlogAvailable,
  isPreviousStructlogAvailable,
  moveNextStructlog,
  movePreviousStructlog,
}) => {
  return (
    <StyledWrapper>
      <StyledHeadingWrapper>
        <StyledHeading>Current Selected Line:</StyledHeading>
        <Button onClick={clearSelectedLine}>Clear Selection</Button>
      </StyledHeadingWrapper>
      <StyledCode>{activeLineContent}</StyledCode>
      {!areStructLogsAvailableForCurrentLine && (
        <StyledHeadingWrapper>
          <StyledHeading>No structlogs available for this code line </StyledHeading>
        </StyledHeadingWrapper>
      )}
      <StyledNavigationButtonsWrapper>
        <Button
          onClick={movePreviousStructlog}
          disabled={!isPreviousStructlogAvailable}
        >
          Previous structlog
        </Button>
        <Button
          onClick={moveNextStructlog}
          disabled={!isNextStructlogAvailable}
        >
          Next structlog
        </Button>
      </StyledNavigationButtonsWrapper>
      <StyledNavigationButtonsWrapper>
        <Button
          onClick={moveToPreviousAvailableLine}
          disabled={!isPreviousLineAvailable}
        >
          Previous available line
        </Button>
        <Button
          onClick={moveToNextAvailableLine}
          disabled={!isNextLineAvailable}
        >
          Next available line
        </Button>
      </StyledNavigationButtonsWrapper>
    </StyledWrapper>
  )
}
