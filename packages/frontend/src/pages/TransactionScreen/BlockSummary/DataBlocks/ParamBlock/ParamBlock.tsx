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

import type { ParamBlockProps, TItem } from './ParamBlock.types'

export const ParamBlock = ({ items, title, ...props }: ParamBlockProps) => {
  return (
    <StyledAccordion {...props}>
      <StyledAccordionSummary expandIcon={<ArrowDownBlue />}>
        {title}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <List>
          {items &&
            items.map((item, index) => {
              if (
                (item && typeof item.value === 'string') ||
                (item && typeof item.value === 'number')
              )
                return (
                  <React.Fragment key={index}>
                    <Tooltip title={item.type} arrow followCursor>
                      <StyledInfoRow key={index}>
                        <StyledInfoType>
                          {item.name ? item.name : `(${item.type})`}
                        </StyledInfoType>
                        <StyledInfoValue>{item.value}</StyledInfoValue>
                      </StyledInfoRow>
                    </Tooltip>
                  </React.Fragment>
                )

              if (item && isArrayOfStrings(item.value))
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
              if (item)
                return (
                  <ParamBlock
                    key={index}
                    title={item.name ? `${item.name}` : `[${index}] element`}
                    items={item.value as TItem[]}
                  />
                )
            })}
        </List>
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}
