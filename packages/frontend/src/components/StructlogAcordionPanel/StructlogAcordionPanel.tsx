import type { ReactElement } from 'react'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { AccordionSummary, AccordionDetails } from '@mui/material'
import { Stack } from '@mui/system'

import type { StructlogAcordionPanelProps } from './StructlogAcordionPanel.types'
import { StyledAccordion } from './styles'

export const StructlogAcordionPanel = ({ text, children, ...props }: StructlogAcordionPanelProps) => {
  const [isExpanded, setExpanded] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) setContainerHeight(container.clientHeight)
  }, [])
  const rootStyles: React.CSSProperties = isExpanded ? { flexGrow: 1 } : {}
  const handleExpand = useCallback(() => setExpanded(!isExpanded), [isExpanded])

  return (
    <StyledAccordion ref={containerRef} {...props} expanded={isExpanded} sx={{ ...rootStyles, transition: 'all 0.4s ease-in-out' }}>
      <AccordionSummary onClick={handleExpand}>{text}</AccordionSummary>
      <AccordionDetails>
        {containerHeight ? (
          <Stack sx={{ width: '100%', position: 'relative', overflow: 'auto', height: 'calc(100% - 72px)' }}>
            <Stack sx={{ width: '100%', position: 'absolute', height: ' 100%' }}>{children}</Stack>
          </Stack>
        ) : null}
      </AccordionDetails>
    </StyledAccordion>
  )
}
