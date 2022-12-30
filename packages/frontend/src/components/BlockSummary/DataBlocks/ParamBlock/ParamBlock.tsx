import { AccordionDetails, AccordionSummary, List } from '@mui/material'
import React from 'react'

import { isArrayOfStrings } from '../../../../helpers/helpers'
import { StyledInfoRow, StyledInfoType, StyledInfoValue, StyleRawBytecode } from '../../styles'

import type { ParamBlockProps } from './ParamBlock.types'
import { StyledAccordion } from './styles'

export const ParamBlock = ({ items, title, ...props }: ParamBlockProps) => {
  return (
    <StyledAccordion {...props}>
      <AccordionSummary>{title}</AccordionSummary>
      <AccordionDetails>
        <List>
          {items.map((item, index) => {
            if (typeof item.value === 'string')
              return (
                <React.Fragment key={index}>
                  <StyledInfoRow key={index}>
                    <StyledInfoType>
                      {item.name} ({item.type})
                    </StyledInfoType>
                    {item.type === 'bytes' ? (
                      <StyleRawBytecode>{item.value}</StyleRawBytecode>
                    ) : (
                      <StyledInfoValue>{item.value}</StyledInfoValue>
                    )}
                  </StyledInfoRow>
                </React.Fragment>
              )

            if (isArrayOfStrings(item.value))
              return (
                <React.Fragment key={index}>
                  <StyledInfoRow key={index}>
                    <StyledInfoType>
                      {item.name} ({item.type})
                    </StyledInfoType>
                    <StyledInfoValue>
                      {item.value.length === 0
                        ? '[ ]'
                        : item.value.map((value, nestedIndex) => {
                            return (
                              <>
                                <StyledInfoRow key={nestedIndex}>
                                  <StyledInfoValue>{value}</StyledInfoValue>
                                </StyledInfoRow>
                              </>
                            )
                          })}
                    </StyledInfoValue>
                  </StyledInfoRow>
                </React.Fragment>
              )

            return <ParamBlock key={index} title={`${item.name} (${item.type})`} items={item.value} />
          })}
        </List>
      </AccordionDetails>
    </StyledAccordion>
  )
}
