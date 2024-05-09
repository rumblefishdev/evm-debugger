import React from 'react'
import { Stack } from '@mui/material'

import { StyledPanel, StyledHeading, StyledHeadingWrapper } from '../styles'
import { Button } from '../../../../components/Button'

import { MemoryInfoCard, StackInfoCard, StorageInfoCard } from './Cards'
import { StyledCardsWrapper } from './InformationPanel.styles'

export const InformationPanel: React.FC = () => {
  const [isExpanded, setExpanded] = React.useState(false)

  const toggleExpanded = () => {
    setExpanded(!isExpanded)
  }

  return (
    <StyledPanel>
      <StyledHeadingWrapper justifyContent="space-between">
        <StyledHeading>State Information</StyledHeading>
        <Button
          size="small"
          onClick={toggleExpanded}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </StyledHeadingWrapper>
      <StyledCardsWrapper expanded={isExpanded}>
        <Stack
          direction="row"
          width="100%"
          height="100%"
          overflow="auto"
          flex={1}
          gap={2}
        >
          <StackInfoCard />
          <MemoryInfoCard />
        </Stack>
        <Stack
          flex={1}
          overflow="auto"
          width="100%"
          height="100%"
        >
          <StorageInfoCard />
        </Stack>
      </StyledCardsWrapper>
    </StyledPanel>
  )
}
