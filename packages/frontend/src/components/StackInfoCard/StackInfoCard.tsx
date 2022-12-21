import React, { useMemo } from 'react'

import { useTypedSelector } from '../../store/storeHooks'
import { selectStructlogStack } from '../../store/structlogs/structlogs.slice'
import { StructlogAcordionPanel } from '../StructlogAcordionPanel'

import type { StackInfoCardProps } from './StackInfoCard.types'
import { StyledRecord, StyledRecordIndex, StyledRecordValue, StyledStack } from './styles'

export const StackInfoCard = ({ ...props }: StackInfoCardProps) => {
  const stack = useTypedSelector(selectStructlogStack)

  const parsedStack = useMemo(() => {
    return stack.map((stackItem, index) => {
      const defaultString = '0000'
      const hexValue = (stack.length - 1 - index).toString()
      const paddedHexValue = defaultString.slice(0, Math.max(0, defaultString.length - hexValue.length)) + hexValue

      return { value: stackItem, index: paddedHexValue }
    })
  }, [stack])

  console.log(stack)

  return (
    <StructlogAcordionPanel text="Stack" canExpand={stack.length > 0}>
      <StyledStack {...props}>
        {parsedStack.map((stackItem) => {
          const isSelected: React.CSSProperties = stackItem.value.isSelected ? { background: 'rgba(0, 0, 0, 0.04)' } : {}

          return (
            <StyledRecord direction="row" sx={isSelected}>
              <StyledRecordIndex>{stackItem.index}</StyledRecordIndex>
              <StyledRecordValue>{stackItem.value.value}</StyledRecordValue>
            </StyledRecord>
          )
        })}
      </StyledStack>
    </StructlogAcordionPanel>
  )
}
