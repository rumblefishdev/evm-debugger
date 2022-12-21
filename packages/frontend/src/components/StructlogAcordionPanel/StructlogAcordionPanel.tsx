import type { ReactElement } from 'react'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { AccordionSummary, AccordionDetails } from '@mui/material'

import type { StructlogAcordionPanelProps } from './StructlogAcordionPanel.types'
import { StyledAccordion, StyledAccordionSummary, StyledContainer, StyledWrapper } from './styles'

export const StructlogAcordionPanel = ({ text, children, ...props }: StructlogAcordionPanelProps) => {
  const [isExpanded, setExpanded] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) setContainerHeight(container.clientHeight)
  }, [])

  const rootStyles = isExpanded ? { flexGrow: 1 } : {}
  const handleExpand = useCallback(() => setExpanded(!isExpanded), [isExpanded])

  return (
    <StyledAccordion ref={containerRef} {...props} expanded={isExpanded} sx={{ ...rootStyles }}>
      <StyledAccordionSummary onClick={handleExpand}>{text}</StyledAccordionSummary>
      <AccordionDetails>
        {containerHeight ? (
          <StyledWrapper>
            <StyledContainer>{children}</StyledContainer>
          </StyledWrapper>
        ) : null}
      </AccordionDetails>
    </StyledAccordion>
  )
}
