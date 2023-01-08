import React from 'react'

import { useTypedSelector } from '../../../../../../store/storeHooks'
import { selectParsedStack } from '../../../../../../store/structlogs/structlogs.slice'
import { StructlogAcordionPanel } from '../../../../../../components/StructlogAcordionPanel'
import { StyledRecordType, StyledRecordValue, StyledWrapper, StyledRecord } from '../styles'

import type { StackInfoCardProps } from './StackInfoCard.types'

export const StackInfoCard = ({ ...props }: StackInfoCardProps) => {
  const stack = useTypedSelector(selectParsedStack)
  const activeStructlog = useTypedSelector((state) => state.structLogs.activeStructLog)

  return (
    <StructlogAcordionPanel text="Stack" canExpand={stack.length > 0}>
      <StyledWrapper {...props}>
        {stack.map((stackItem, index) => {
          const isSelected: React.CSSProperties = stackItem.value.isSelected ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

          const argName = activeStructlog.args[index]

          const name = argName?.name ? `${argName.name}` : stackItem.index

          return (
            <StyledRecord direction="row" sx={isSelected} key={index}>
              <StyledRecordType>{name}</StyledRecordType>
              <StyledRecordValue>{stackItem.value.value}</StyledRecordValue>
            </StyledRecord>
          )
        })}
      </StyledWrapper>
    </StructlogAcordionPanel>
  )
}
