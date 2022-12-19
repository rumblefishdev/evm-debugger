import React, { useMemo } from 'react'
import { Typography } from '@mui/material'

import type { StackInfoCardProps } from './StackInfoCard.types'
import { StyledRecord, StyledRecordIndex, StyledStack } from './styles'

export const StackInfoCard = ({ stack, ...props }: StackInfoCardProps) => {
  const parsedStack = useMemo(() => {
    return stack.map((stackItem, index) => {
      const defaultString = '00000000'
      const hexValue = (index * 32).toString(16)
      const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue
      const splitStackItem = [...stackItem.match(/.{1,2}/g)]

      return { value: splitStackItem, index: paddedHexValue }
    })
  }, [stack])

  return (
    <StyledStack {...props}>
      {parsedStack.map((stackItem) => {
        return (
          <StyledRecord direction="row">
            <StyledRecordIndex>{stackItem.index}</StyledRecordIndex>
            {stackItem.value.map((value) => {
              return <Typography sx={{ width: '32px' }}>{value}</Typography>
            })}
          </StyledRecord>
        )
      })}
    </StyledStack>
  )
}
