import React, { useCallback, useState, useRef, useEffect } from 'react'
import { AccordionDetails } from '@mui/material'

import type { StructlogAcordionPanelProps } from './StructlogAcordionPanel.types'
import { StyledAccordion, StyledAccordionSummary, StyledContainer, StyledWrapper } from './styles'

export const StructlogAcordionPanel = ({ canExpand = false, text, children, ...props }: StructlogAcordionPanelProps) => {
  const [isExpanded, setExpanded] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) setContainerHeight(container.clientHeight)
  }, [])

  const rootStyles = isExpanded && canExpand ? { flexGrow: 1 } : {}
  const canExpandStyles = canExpand ? { cursor: 'pointer' } : { backgroundColor: 'rgba(0, 0, 0, 0.12)' }
  const handleExpand = useCallback(() => setExpanded(!isExpanded && canExpand), [isExpanded, canExpand])

  return (
    <StyledAccordion ref={containerRef} {...props} expanded={isExpanded && canExpand} sx={{ ...rootStyles, ...canExpandStyles }}>
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
