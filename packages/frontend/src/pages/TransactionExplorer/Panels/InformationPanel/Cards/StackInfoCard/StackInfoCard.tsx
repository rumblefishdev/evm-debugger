import React from 'react'
import { useSelector } from 'react-redux'

import { activeStructLogSelectors } from '../../../../../../store/activeStructLog/activeStructLog.selectors'
import {
  StyledRecordType,
  StyledRecordValue,
  StyledWrapper,
  StyledRecord,
  StyledCard,
  StyledCardHeading,
  StyledCardHeadingWrapper,
} from '../styles'

export const skipLeadingZeroes = (value: string): string => {
  return `0x${value.replace(/^0+/, '')}`
}

export const StackInfoCard = () => {
  const stack = useSelector(activeStructLogSelectors.selectParsedStack)
  const activeStructlog = useSelector(activeStructLogSelectors.selectActiveStructLog)
  const hasStack = React.useMemo(() => stack.length > 0, [stack])

  return (
    <StyledCard>
      <StyledCardHeadingWrapper>
        <StyledCardHeading>Stack</StyledCardHeading>
      </StyledCardHeadingWrapper>
      {!hasStack && <p>This EVM Step has no stack.</p>}
      {hasStack && (
        <StyledWrapper>
          {stack.map((stackItem, index) => {
            const isSelected: React.CSSProperties = stackItem.value.isSelected ? { background: 'rgba(0, 0, 0, 0.04)' } : {}
            const argName = activeStructlog.args[index]
            const name = argName?.name ? `${argName.name}` : stackItem.index

            return (
              <StyledRecord
                key={index}
                sx={isSelected}
              >
                <StyledRecordType>{name}</StyledRecordType>
                <StyledRecordValue>{skipLeadingZeroes(stackItem.value.value)}</StyledRecordValue>
              </StyledRecord>
            )
          })}
        </StyledWrapper>
      )}
    </StyledCard>
  )
}
