import React from 'react'

import { useTypedSelector } from '../../../../../../store/storeHooks'
import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import {
  selectParsedMemory,
  selectParsedStack,
} from '../../../../../../store/structlogs/structlogs.slice'
import {
  StyledRecordType,
  StyledRecordValue,
  StyledWrapper,
  StyledRecord,
} from '../styles'

import type { MemoryInfoCardProps } from './MemoryInfoCard.types'

export const MemoryInfoCard = ({ ...props }: MemoryInfoCardProps) => {
  const memory = useTypedSelector(selectParsedMemory)
  const stack = useTypedSelector(selectParsedStack)
  const activeStructlog = useTypedSelector(
    (state) => state.structLogs.activeStructLog,
  )
  const decorateBytes = (
    offset: string,
    index: number,
  ): React.CSSProperties => {
    const highlight: React.CSSProperties = {
      background: 'yellow',
    }
    const underline: React.CSSProperties = {
      borderBottom: '1px solid red',
    }
    const cssProperties: React.CSSProperties = {}
    switch (activeStructlog.op) {
      case 'MLOAD': {
        console.log({ stack, offset, index, activeStructlog })
        break
      }
      case 'MSTORE': {
        break
      }
      case 'RETURN': {
        break
      }
      default: {
        break
      }
    }
    return cssProperties
  }
  return (
    <StructlogAcordionPanel text="Memory" canExpand={memory.length > 0}>
      <StyledWrapper {...props}>
        {memory.map((memoryItem) => {
          return (
            <StyledRecord direction="row" key={memoryItem.index}>
              <StyledRecordType>{memoryItem.index}</StyledRecordType>
              {memoryItem.value.map((value, index) => {
                return (
                  <StyledRecordValue
                    style={decorateBytes(memoryItem.index, index)}
                    key={index}
                  >
                    {value}
                  </StyledRecordValue>
                )
              })}
            </StyledRecord>
          )
        })}
      </StyledWrapper>
    </StructlogAcordionPanel>
  )
}
