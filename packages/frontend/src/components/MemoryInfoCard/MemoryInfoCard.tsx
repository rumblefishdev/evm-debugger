import React, { useMemo } from 'react'
import { Typography } from '@mui/material'

import { useTypedSelector } from '../../store/storeHooks'
import { selectStructlogMemory } from '../../store/activeStructlog/activeStructlog.slice'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'
import { StyledRecord, StyledRecordIndex, StyledStack } from './styles'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useTypedSelector(selectStructlogMemory)

  const parsedStack = useMemo(() => {
    return memory.map((memoryItem, index) => {
      const defaultString = '00000000'
      const hexValue = (index * 32).toString(16)
      const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue
      const splitMemoryItem = [...memoryItem.match(/.{1,2}/g)]

      return { value: splitMemoryItem, index: paddedHexValue }
    })
  }, [memory])

  return (
    <StyledStack {...props}>
      {parsedStack.map((memoryItem) => {
        return (
          <StyledRecord direction="row">
            <StyledRecordIndex>{memoryItem.index}</StyledRecordIndex>
            {memoryItem.value.map((value) => {
              return <Typography sx={{ width: '32px' }}>{value}</Typography>
            })}
          </StyledRecord>
        )
      })}
    </StyledStack>
  )
}
