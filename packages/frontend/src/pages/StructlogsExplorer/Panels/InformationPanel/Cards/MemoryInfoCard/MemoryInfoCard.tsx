import React from 'react'

import { useTypedSelector } from '../../../../../../store/storeHooks'
import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { selectParsedMemory } from '../../../../../../store/structlogs/structlogs.slice'
import { StyledRecordType, StyledRecordValue, StyledWrapper, StyledRecord } from '../styles'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useTypedSelector(selectParsedMemory)

  return (
    <StructlogAcordionPanel text="Memory" canExpand={memory.length > 0}>
      <StyledWrapper {...props}>
        {memory.map((memoryItem, index) => {
          return (
            <StyledRecord direction="row" key={index}>
              <StyledRecordType>{memoryItem.index}</StyledRecordType>
              {memoryItem.value.map((value) => {
                return <StyledRecordValue>{value}</StyledRecordValue>
              })}
            </StyledRecord>
          )
        })}
      </StyledWrapper>
    </StructlogAcordionPanel>
  )
}
