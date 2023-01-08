import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Stack,
} from '@mui/material'
import React from 'react'

import {
  StyledInfoRow,
  StyledInfoType,
  StyledInfoValue,
  StyleRawBytecode,
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionDetails,
} from '../styles'

import type { EventBlockProps } from './EventBlock.types'

export const EventBlock = ({ eventLogs, ...props }: EventBlockProps) => (
  <Stack sx={{ marginBottom: '12px' }} {...props}>
    {eventLogs.map((event, rootIndex) =>
      event.signature ? (
        <StyledAccordion key={rootIndex}>
          <StyledAccordionSummary>{event.signature}</StyledAccordionSummary>
          <StyledAccordionDetails>
            <List>
              {event.parsedArgs.map((arg, index) => {
                return (
                  <StyledInfoRow key={index}>
                    <StyledInfoType>{arg.name}</StyledInfoType>
                    {arg.type === 'bytes' ? (
                      <StyleRawBytecode>{arg.value}</StyleRawBytecode>
                    ) : (
                      <StyledInfoValue>{arg.value}</StyledInfoValue>
                    )}
                  </StyledInfoRow>
                )
              })}
            </List>
          </StyledAccordionDetails>
        </StyledAccordion>
      ) : null,
    )}
  </Stack>
)
