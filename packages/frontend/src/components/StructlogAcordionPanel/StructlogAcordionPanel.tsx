import React, { useCallback, useState } from 'react'
import { AccordionDetails } from '@mui/material'

import type { StructlogAcordionPanelProps } from './StructlogAcordionPanel.types'
import {
  StyledAccordion,
  StyledAccordionSummary,
  StyledContainer,
  StyledWrapper,
} from './styles'

export const StructlogAcordionPanel = ({
  canExpand = false,
  text,
  children,
  ...props
}: StructlogAcordionPanelProps) => {
  const [isExpanded, setExpanded] = useState(false)

  const rootStyles = isExpanded && canExpand ? { flexGrow: 1 } : {}
  const canExpandStyles = canExpand
    ? { cursor: 'pointer' }
    : { backgroundColor: 'rgba(0, 0, 0, 0.12)' }
  const handleExpand = useCallback(
    () => setExpanded(!isExpanded && canExpand),
    [isExpanded, canExpand],
  )

  return (
    <StyledAccordion
      {...props}
      expanded={isExpanded && canExpand}
      sx={{ ...rootStyles, ...canExpandStyles }}
    >
      <StyledAccordionSummary onClick={handleExpand}>
        {text}
      </StyledAccordionSummary>
      <AccordionDetails>
        <StyledWrapper>
          <StyledContainer>{children}</StyledContainer>
        </StyledWrapper>
      </AccordionDetails>
    </StyledAccordion>
  )
}
