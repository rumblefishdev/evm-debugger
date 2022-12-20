import React, { useMemo } from 'react'
import { Typography } from '@mui/material'

import { useTypedSelector } from '../../store/storeHooks'
import { selectStructlogStack } from '../../store/activeStructlog/activeStructlog.slice'

import type { StackInfoCardProps } from './StackInfoCard.types'
import { StyledRecord, StyledRecordIndex, StyledStack } from './styles'

export const StackInfoCard = ({ ...props }: StackInfoCardProps) => {
  const stack = useTypedSelector(selectStructlogStack)

  const parsedStack = useMemo(() => {
    return stack.map((stackItem, index) => {
      const defaultString = '00000000'
      const hexValue = (index * 32).toString(16)
      const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue

      return { value: stackItem, index: paddedHexValue }
    })
  }, [stack])

  return (
    <StyledStack {...props}>
      {parsedStack.map((stackItem) => {
        const isSelected: React.CSSProperties = stackItem.value.isSelected ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

        return (
          <StyledRecord direction="row" sx={isSelected}>
            <StyledRecordIndex>{stackItem.index}</StyledRecordIndex>
            <Typography sx={{ width: '32px' }}>{stackItem.value.value}</Typography>
          </StyledRecord>
        )
      })}
    </StyledStack>
  )
}
