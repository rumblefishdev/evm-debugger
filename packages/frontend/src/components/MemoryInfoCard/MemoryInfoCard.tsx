import React, { useMemo } from 'react'

import { useTypedSelector } from '../../store/storeHooks'
import { selectStructlogMemory } from '../../store/structlogs/structlogs.slice'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'
import { StyledRecord, StyledRecordIndex, StyledRecordValue, StyledStack } from './styles'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useTypedSelector(selectStructlogMemory)

  const parsedMemory = useMemo(() => {
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
      {parsedMemory.map((memoryItem) => {
        return (
          <StyledRecord direction="row">
            <StyledRecordIndex>{memoryItem.index}</StyledRecordIndex>
            {memoryItem.value.map((value) => {
              return <StyledRecordValue>{value}</StyledRecordValue>
            })}
          </StyledRecord>
        )
      })}
    </StyledStack>
  )
}
