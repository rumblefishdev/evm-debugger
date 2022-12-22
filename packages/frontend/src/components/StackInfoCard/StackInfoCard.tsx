import React from 'react'

import { useTypedSelector } from '../../store/storeHooks'
import { selectParsedStack } from '../../store/structlogs/structlogs.slice'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { StackInfoCardProps } from './StackInfoCard.types'
import { StyledRecord, StyledRecordIndex, StyledRecordValue, StyledStack } from './styles'

export const StackInfoCard = ({ ...props }: StackInfoCardProps) => {
  const stack = useTypedSelector(selectParsedStack)

  return (
    <StructlogAcordionPanel text="Stack" canExpand={stack.length > 0}>
      <StyledStack {...props}>
        {stack.map((stackItem, index) => {
          const isSelected: React.CSSProperties = stackItem.value.isSelected ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

          return (
            <StyledRecord direction="row" sx={isSelected} key={index}>
              <StyledRecordIndex>{stackItem.index}</StyledRecordIndex>
              <StyledRecordValue>{stackItem.value.value}</StyledRecordValue>
            </StyledRecord>
          )
        })}
      </StyledStack>
    </StructlogAcordionPanel>
  )
}
