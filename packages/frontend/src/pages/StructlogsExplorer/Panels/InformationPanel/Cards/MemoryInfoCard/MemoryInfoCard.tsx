import React from 'react'

import { useTypedSelector } from '../../../../../../store/storeHooks'
import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { selectParsedMemory } from '../../../../../../store/structlogs/structlogs.slice'
import {
  StyledRecordType,
  StyledRecordValue,
  StyledWrapper,
  StyledRecord,
} from '../styles'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useTypedSelector(selectParsedMemory)

  return (
    <StructlogAcordionPanel text="Memory" canExpand={memory.length > 0}>
      <StyledWrapper {...props}>
        {memory.map((memoryItem) => {
          return (
            <StyledRecord direction="row" key={memoryItem.index}>
              <StyledRecordType>{memoryItem.index}</StyledRecordType>
              {memoryItem.value.map((value, index) => {
                return (
                  <StyledRecordValue key={index}>{value}</StyledRecordValue>
                )
              })}
            </StyledRecord>
          )
        })}
      </StyledWrapper>
    </StructlogAcordionPanel>
  )
}
