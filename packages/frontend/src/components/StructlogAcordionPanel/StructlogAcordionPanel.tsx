import React, { useCallback, useState } from 'react'

import type { StructlogAcordionPanelProps } from './StructlogAcordionPanel.types'
import { StyledAccordion, StyledAccordionDetails, StyledAccordionSummary, StyledContainer, StyledWrapper } from './styles'

export const StructlogAcordionPanel = ({ canExpand = false, text, children, ...props }: StructlogAcordionPanelProps) => {
  const [isExpanded, setExpanded] = useState(false)

  const handleExpand = useCallback(() => setExpanded(!isExpanded && canExpand), [isExpanded, canExpand])

  return (
    <StyledAccordion {...props} canExpand={canExpand} expanded={isExpanded && canExpand}>
      <StyledAccordionSummary canExpand={canExpand} onClick={handleExpand}>
        {text}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <StyledWrapper>
          <StyledContainer>{children}</StyledContainer>
        </StyledWrapper>
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}
