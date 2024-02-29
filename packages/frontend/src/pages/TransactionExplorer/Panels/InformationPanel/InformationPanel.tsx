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
      <StyledCardsWrapper
        expanded={isExpanded}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <StackInfoCard />
        <MemoryInfoCard />
        <StorageInfoCard />
      </StyledCardsWrapper>
    </StyledPanel>
  )
}
