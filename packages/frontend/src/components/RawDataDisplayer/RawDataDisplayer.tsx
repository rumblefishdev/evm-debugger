import React from 'react'

import { isJson } from '../../helpers/helpers'

import type { RawDataDisplayerProps } from './RawDataDisplayer.types'
import {
  StyledBytecode,
  StyledDataBox,
  StyledDataIndex,
  StyledDataIndexesWrapper,
  StyledDataJson,
  StyledDataWrapper,
  StyledDescription,
  StyledDialog,
  StyledHeader,
  StyledStack,
  StyledTitle,
} from './styles'

export const RawDataDisplayer = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- need to exclude from ...props
  address,
  data,
  title,
  description,
  ...props
}: RawDataDisplayerProps) => {
  const isJsonString = isJson(data)

  const Body = isJsonString ? StyledDataJson : StyledBytecode
  const lines = isJsonString
    ? data.split('\n')
    : Array.from({ length: data.length / 67 + 1 })

  return (
    <StyledDialog {...props}>
      <StyledStack>
        <StyledHeader>
          <StyledTitle>Result for {title}</StyledTitle>
          {description ? (
            <StyledDescription>{description}</StyledDescription>
          ) : null}
        </StyledHeader>
        <StyledDataWrapper>
          <StyledDataIndexesWrapper>
            {lines.map((_, index) => (
              <StyledDataIndex key={index}>{index}</StyledDataIndex>
            ))}
          </StyledDataIndexesWrapper>
          <StyledDataBox>
            <Body>{data}</Body>
          </StyledDataBox>
        </StyledDataWrapper>
      </StyledStack>
    </StyledDialog>
  )
}
