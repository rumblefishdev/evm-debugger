import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Stack,
} from '@mui/material'
import React from 'react'

import { StyledInfoRow, StyledInfoType, StyledInfoValue } from '../../styles'

import type { EventBlockProps } from './EventBlock.types'

export const EventBlock = ({ eventLogs, ...props }: EventBlockProps) => (
  <Stack sx={{ marginBottom: '12px' }} {...props}>
    {eventLogs.map((event, index) =>
      event.signature ? (
        <Accordion>
          <AccordionSummary>{event.signature}</AccordionSummary>
          <AccordionDetails>
            <List>
              {event.parsedArgs.map((arg) => {
                return (
                  <StyledInfoRow>
                    <StyledInfoType>{arg.name}</StyledInfoType>
                    <StyledInfoValue>{arg.value}</StyledInfoValue>
                  </StyledInfoRow>
                )
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : null,
    )}
  </Stack>
)