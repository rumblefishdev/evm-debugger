import React from 'react'

import { useTypedSelector } from '../../store/storeHooks'
import { selectParsedMemory } from '../../store/structlogs/structlogs.slice'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'
import { StyledRecord, StyledRecordIndex, StyledRecordValue, StyledStack } from './styles'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useTypedSelector(selectParsedMemory)

  return (
    <StructlogAcordionPanel text="Memory" canExpand={memory.length > 0}>
      <StyledStack {...props}>
        {memory.map((memoryItem, index) => {
          return (
            <StyledRecord direction="row" key={index}>
              <StyledRecordIndex>{memoryItem.index}</StyledRecordIndex>
              {memoryItem.value.map((value) => {
                return <StyledRecordValue>{value}</StyledRecordValue>
              })}
            </StyledRecord>
          )
        })}
      </StyledStack>
    </StructlogAcordionPanel>
  )
}
