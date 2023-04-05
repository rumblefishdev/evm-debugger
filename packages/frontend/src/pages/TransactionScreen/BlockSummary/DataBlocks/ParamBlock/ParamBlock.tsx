import { List, Tooltip } from '@mui/material'
import React from 'react'

import { isArrayOfStrings } from '../../../../../helpers/helpers'
import { ArrowDownBlue } from '../../../../../icons'
import {
  StyledInfoRow,
  StyledInfoType,
  StyledInfoValue,
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionDetails,
} from '../styles'

import type { ParamBlockProps } from './ParamBlock.types'

export const ParamBlock = ({ items, title, ...props }: ParamBlockProps) => {
  if (!items) {
    console.log('HEY')
    console.log(items)
    console.log(title)
    return <></>
  }
  return (
    <StyledAccordion {...props}>
      <StyledAccordionSummary expandIcon={<ArrowDownBlue />}>
        {title}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <List>
          {items.map((item, index) => {
            if (
              typeof item.value === 'string' ||
              typeof item.value === 'number'
            )
              return (
                <React.Fragment key={index}>
                  <StyledInfoRow key={index}>
                    <Tooltip title={item.type}>
                      <StyledInfoType>
                        {item.name ? item.name : ''}
                      </StyledInfoType>
                    </Tooltip>
                    <StyledInfoValue>{item.value}</StyledInfoValue>
                  </StyledInfoRow>
                </React.Fragment>
              )

            if (isArrayOfStrings(item.value))
              return (
                <React.Fragment key={index}>
                  <StyledInfoRow key={index}>
                    <StyledInfoType>{item.name}</StyledInfoType>
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

            return (
              <ParamBlock
                key={index}
                title={item.name ? `${item.name}` : `[${index}] element`}
                items={item.value}
              />
            )
          })}
        </List>
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}
