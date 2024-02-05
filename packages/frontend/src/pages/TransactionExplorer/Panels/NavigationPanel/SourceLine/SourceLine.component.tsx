import React from 'react'

import { Button } from '../../../../../components/Button'
import { VirtualizedList } from '../../../../../components/VirtualizedList/VirtualizedList'
import type { TStructlogWithListIndex } from '../../../../../store/structlogs/structlogs.types'

import type { TSourceLineComponentProps } from './SourceLine.types'
import {
  StyledPassesThroughSection,
  StyledCode,
  StyledCodeSectionWrapper,
  StyledHeading,
  StyledHeadingWrapper,
  StyledWrapper,
  StyledListWrapper,
  StyledStepElement,
  StyledStepCount,
  StyledChip,
  StyledPassElementText,
} from './SourceLine.styles'

const checkIfStepIsSelected = (activeStructlog: TStructlogWithListIndex, list: TStructlogWithListIndex[]) => {
  return list.some((structlog) => structlog.index === activeStructlog.index)
}

export const SourceLineComponent: React.FC<TSourceLineComponentProps> = ({
  activeLineContent,
  clearSelectedLine,
  areStructLogsAvailableForCurrentLine,
  currentStructLogsByBlocks,
  setActiveStructlog,
  activeStructlog,
}) => {
  return (
    <StyledWrapper>
      <StyledCodeSectionWrapper>
        <StyledHeadingWrapper>
          <StyledHeading>Current Selected Line:</StyledHeading>
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={clearSelectedLine}
          >
            Clear Selection
          </Button>
        </StyledHeadingWrapper>
        <StyledCode>{!areStructLogsAvailableForCurrentLine ? 'No structlogs available for this code line ' : activeLineContent}</StyledCode>
      </StyledCodeSectionWrapper>
      <StyledPassesThroughSection>
        <StyledHeadingWrapper>
          <StyledHeading>Passes through selected line:</StyledHeading>
          <StyledStepCount>Steps count</StyledStepCount>
        </StyledHeadingWrapper>
        <StyledListWrapper>
          <VirtualizedList items={currentStructLogsByBlocks}>
            {(index, item) => {
              const isActive = checkIfStepIsSelected(activeStructlog, item)

              return (
                <StyledStepElement
                  active={isActive}
                  key={index}
                  onClick={() => setActiveStructlog(item[0])}
                >
                  <StyledPassElementText active={isActive}>Pass through {index}</StyledPassElementText>
                  <StyledChip active={isActive}>{item.length} steps</StyledChip>
                </StyledStepElement>
              )
            }}
          </VirtualizedList>
        </StyledListWrapper>
      </StyledPassesThroughSection>
    </StyledWrapper>
  )
}
