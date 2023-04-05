import { List, Stack } from '@mui/material'
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
import { ParamBlock } from '../ParamBlock'

import type { EventBlockProps } from './EventBlock.types'

export const EventBlockNew = ({ eventLogs, ...props }: EventBlockProps) => (
  <Stack sx={{ marginBottom: '12px' }} {...props}>
    {eventLogs.map((event, rootIndex) => {
      return (
        <ParamBlock
          key={rootIndex}
          title={`${event.signature}`}
          items={event.parsedArgs}
        />
      )
    })}
  </Stack>
)

// )

export const EventBlock = ({ eventLogs, ...props }: EventBlockProps) => (
  <Stack sx={{ marginBottom: '12px' }} {...props}>
    {eventLogs.map((event, rootIndex) =>
      event.signature ? (
        <StyledAccordion key={rootIndex}>
          <StyledAccordionSummary>{event.signature}</StyledAccordionSummary>
          <StyledAccordionDetails>
            <List>
              {event.parsedArgs.map((arg, index) => {
                if (Array.isArray(arg.value) && arg.type === 'tuple[]') {
                  const tuples = arg.value
                  return (
                    <List>
                      {tuples.map((tuple, tupleIndex) => {
                        return (
                          <React.Fragment key={tupleIndex}>
                            <StyledInfoRow key={tupleIndex}>
                              <StyledInfoType>
                                {arg.name} ({tuple.type})
                              </StyledInfoType>
                              <StyledInfoValue>
                                <List>
                                  {tuple.value.length === 0
                                    ? '[ ]'
                                    : tuple.value.map((value, nestedIndex) => {
                                        return (
                                          <StyledInfoRow key={nestedIndex}>
                                            <StyledInfoType>
                                              {value.name}
                                            </StyledInfoType>
                                            <StyledInfoValue>
                                              {value.value}
                                            </StyledInfoValue>
                                          </StyledInfoRow>
                                        )
                                      })}
                                </List>
                              </StyledInfoValue>
                            </StyledInfoRow>
                          </React.Fragment>
                        )
                      })}
                    </List>
                  )
                }
                if (
                  typeof arg.value === 'string' ||
                  typeof arg.value === 'number'
                )
                  return (
                    <StyledInfoRow key={index}>
                      <StyledInfoType>{arg.name}</StyledInfoType>
                      {arg.type === 'bytes' || arg.type === 'address' ? (
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
