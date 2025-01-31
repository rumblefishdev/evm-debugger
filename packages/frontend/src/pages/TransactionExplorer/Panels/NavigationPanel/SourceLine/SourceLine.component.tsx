import React from 'react'
import { indicator } from 'ordinal'
import { IconButton, Stack } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

import { Button } from '../../../../../components/Button'
import { VirtualizedList } from '../../../../../components/VirtualizedList/VirtualizedList'
import type { IExtendedStructLog } from '../../../../../types'

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

const checkIfStepIsSelected = (activeStructlog: IExtendedStructLog, list: IExtendedStructLog[]) => {
  return list.some((structlog) => structlog?.index === activeStructlog?.index)
}

export const SourceLineComponent: React.FC<TSourceLineComponentProps> = ({
  activeLineContent,
  areStructLogsAvailableForCurrentLine,
  currentStructLogsByBlocks,
  activeStructlog,
  isNextLineAvailable,
  isPreviousLineAvailable,
  clearSelectedLine,
  setActiveStructlog,
  moveToNextAvailableLine,
  moveToPreviousAvailableLine,
}) => {
  return (
    <StyledWrapper>
      <StyledCodeSectionWrapper>
        <StyledHeadingWrapper>
          <Stack
            flexDirection="row"
            alignItems="center"
          >
            <StyledHeading>Current Selected Line</StyledHeading>
            <IconButton
              size="small"
              color="primary"
              disabled={!isPreviousLineAvailable}
              onClick={moveToPreviousAvailableLine}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              disabled={!isNextLineAvailable}
              onClick={moveToNextAvailableLine}
            >
              <KeyboardArrowRight />
            </IconButton>
          </Stack>
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={clearSelectedLine}
          >
            Clear Selection
          </Button>
        </StyledHeadingWrapper>
        <StyledCode>{activeLineContent}</StyledCode>
      </StyledCodeSectionWrapper>
      {!areStructLogsAvailableForCurrentLine && <StyledCode sx={{ marginTop: 1 }}>No structlogs available for this code line </StyledCode>}
      {areStructLogsAvailableForCurrentLine && (
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
                    <StyledPassElementText active={isActive}>
                      {index + 1}
                      {indicator(index + 1)} Pass through
                    </StyledPassElementText>
                    <StyledChip active={isActive}>{item.length} steps</StyledChip>
                  </StyledStepElement>
                )
              }}
            </VirtualizedList>
          </StyledListWrapper>
        </StyledPassesThroughSection>
      )}
    </StyledWrapper>
  )
}
